import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import MeetingLobby from '../meeting/MeetingLobby';
import MeetingControls from '../meeting/MeetingControls';
import ChatPanel from '../meeting/ChatPanel';
import VideoGrid from '../meeting/VideoGrid';
import { v4 as uuidv4 } from 'uuid';
import api from '../../utils/api'; // Adjust the path to your api file
import { useAuth } from '../../context/authecontext';

const server_url = "http://localhost:3000";

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

var connections = {};



export default function VideoMeetComponent({setinmeeting}) {

    // Refs
    const socketRef = useRef();
    const socketIdRef = useRef();
    const localVideoref = useRef();
    const videoRef = useRef([]);

    // State
    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);
    const [videos, setVideos] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);
    const [showChat, setShowChat] = useState(false);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [meetingId, setMeetingId] = useState(null);
   const {user}=useAuth();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('meetingId');
        if (id) {
            setMeetingId(id);
        } else {
            const newId = uuidv4();
            setMeetingId(newId);
            window.history.replaceState(null, null, `?meetingId=${newId}`);
        }
       
        getPermissions();
    }, []);

    
    const getDislayMedia = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            handleStreamSuccess(screenStream, true);
        } catch (e) {
            console.log("Error accessing display media: ", e);
        }
    };

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    const getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then((stream) => {
                    handleStreamSuccess(stream, false);
                    stream.getVideoTracks().forEach(track => track.enabled = true); // Ensure tracks are enabled
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = stream; // Assign stream to video element
                    }
                })
               
                .catch((e) => console.log("Error accessing user media: ", e));
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) {
                console.log(e);
            }
        }
    };
    const handleStreamSuccess = (stream, isScreen = false) => {
        try {
            // Stop the current local stream tracks
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        } catch (e) {
            console.log('Error stopping old tracks:', e);
        }
    
        // Set the new stream
        window.localStream = stream;
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }
    
        // Add the new stream to all connections
        for (let id in connections) {
            if (id === socketIdRef.current) continue;
    
            try {
                // Remove old stream and add new stream
                connections[id].removeStream(window.localStream);
                connections[id].addStream(stream);

                // Create and send new offer
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                        })
                        .catch(e => console.log('Error setting local description:', e));
                });
            } catch (e) {
                console.log('Error updating peer connection:', e);
            }
        }
    
        // Handle stream end
        stream.getTracks().forEach(track => {
            if (track) {
                track.onended = () => {
                    if (isScreen) {
                        setScreen(false); // Update state to reflect that screen sharing has stopped
                        getUserMedia(); // Switch back to camera when screen sharing ends
                    }
                };
            }
        });
    };

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }


    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };
    const connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });
    
        socketRef.current.on('signal', gotMessageFromServer);
    
        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', meetingId); // Use meetingId
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage);

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
            });
    
            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    };
    
                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);
    
                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };
    
                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };
    
                    if (window.localStream) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                });
    
                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;
    
                        try {
                            connections[id2].addStream(window.localStream);
                        } catch (e) { }
    
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }));
                                })
                                .catch(e => console.log(e));
                        });
                    }
                }
            });
        });
    };

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }
    const handleVideo = async () => {
        setVideo((prevVideo) => {
            const newVideoState = !prevVideo;
            
            if (newVideoState) {
                // Turn video back on
                navigator.mediaDevices.getUserMedia({ video: true, audio: audio })
                    .then((stream) => {
                        // Stop old tracks
                        if (window.localStream) {
                            window.localStream.getTracks().forEach(track => track.stop());
                        }
                        
                        // Set new stream
                        window.localStream = stream;
                        if (localVideoref.current) {
                            localVideoref.current.srcObject = stream;
                        }

                        // Update all peer connections
                        for (let id in connections) {
                            if (id === socketIdRef.current) continue;

                            try {
                                // Remove old video tracks and add new stream
                                connections[id].removeStream(window.localStream);
                                connections[id].addStream(stream);

                                // Create and send new offer
                                connections[id].createOffer().then((description) => {
                                    connections[id].setLocalDescription(description)
                                        .then(() => {
                                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                                        })
                                        .catch(e => console.log('Error setting local description:', e));
                                });
                            } catch (e) {
                                console.log('Error updating peer connection:', e);
                            }
                        }
                    })
                    .catch((e) => console.log("Error accessing user media: ", e));
            } else {
                // Turn video off
                const blackStream = new MediaStream([black()]);
                
                // Stop old tracks
                if (window.localStream) {
                    window.localStream.getTracks().forEach(track => {
                        if (track.kind === 'video') {
                            track.stop();
                        }
                    });
                }
                
                // Set new stream
                window.localStream = blackStream;
                if (localVideoref.current) {
                    localVideoref.current.srcObject = blackStream;
                }

                // Update all peer connections
                for (let id in connections) {
                    if (id === socketIdRef.current) continue;

                    try {
                        // Remove old video tracks and add new stream
                        connections[id].removeStream(window.localStream);
                        connections[id].addStream(blackStream);

                        // Create and send new offer
                        connections[id].createOffer().then((description) => {
                            connections[id].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                                })
                                .catch(e => console.log('Error setting local description:', e));
                        });
                    } catch (e) {
                        console.log('Error updating peer connection:', e);
                    }
                }
            }
            return newVideoState;
        });
    };
    
    const handleAudio = () => {
        setAudio((prevAudio) => {
            const newAudioState = !prevAudio;
            if (window.localStream) {
                window.localStream.getAudioTracks().forEach(track => track.enabled = newAudioState);
            }
            return newAudioState;
        });
    };
    const handleScreen = () => {
        setScreen((prevScreen) => {
            const newScreenState = !prevScreen;
            if (newScreenState) {
                getDislayMedia(); // Start screen sharing
            } else {
                getUserMedia(); // Switch back to camera
            }
            return newScreenState;
        });
    };

    const handleEndCall = async () => {
      try {
        // First, collect all the meeting data
        const participants = [
          { 
            user: user._id,  // Current user's ID (should be a valid MongoDB ObjectId)
            username: username || "Guest"  // Current user's username
          }
        ];

        // Add other participants only if they have valid user IDs
        videos.forEach(video => {
          if (video.userId) {  // Only add participants with valid user IDs
            participants.push({
              user: video.userId,
              username: video.username || "Guest"
            });
          }
        });
    
        const chatMessages = messages.map(msg => ({
          sender: msg.sender || "Guest",
          message: msg.data,
          createdAt: new Date()  // Add timestamp for each message
        }));

        // Validate required data
        if (!meetingId) {
          throw new Error("Meeting ID is required");
        }

        if (!participants.length) {
          throw new Error("At least one participant is required");
        }

        console.log('Saving meeting history with data:', {
          meeting_id: meetingId,
          participants,
          chats: chatMessages
        });

        // Make API call to save meeting history
        const response = await api.post('/meeting/addhistory', {
          meeting_id: meetingId,
          participants,
          chats: chatMessages
        });

        console.log('Meeting history saved successfully:', response.data);
    
        // After successfully saving the history, proceed with ending the call
        // Stop media tracks
        if (localVideoref.current && localVideoref.current.srcObject) {
          localVideoref.current.srcObject.getTracks().forEach(track => track.stop());
        }

        // Stop all remote video tracks
        videos.forEach(video => {
          if (video.stream) {
            video.stream.getTracks().forEach(track => track.stop());
          }
        });
    
        // Clean up socket connections
        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        // Clean up peer connections
        Object.values(connections).forEach(connection => {
          connection.close();
        });
        connections = {};
    
        // Update meeting state
        setinmeeting(false);

        // Navigate to home page
        window.location.href = "/";
      } catch (error) {
        console.error('Error saving meeting history:', error);
        // Even if saving history fails, we should still end the call
        if (localVideoref.current && localVideoref.current.srcObject) {
          localVideoref.current.srcObject.getTracks().forEach(track => track.stop());
        }

        // Stop all remote video tracks
        videos.forEach(video => {
          if (video.stream) {
            video.stream.getTracks().forEach(track => track.stop());
          }
        });

        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        // Clean up peer connections
        Object.values(connections).forEach(connection => {
          connection.close();
        });
        connections = {};

        setinmeeting(false);
        window.location.href = "/";
      }
    };
    const handleChatToggle = () => setShowChat(!showChat);
    const handleSendMessage = () => {
        console.log(message, username);
        socketRef.current.emit('chat-message', message, username);
        setMessage("");
    };

    const connect = () => {
        setAskForUsername(false);
        setinmeeting(true);
        getMedia();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900">
            {askForUsername ? (
                <MeetingLobby
                    username={username}
                    setUsername={setUsername}
                    onConnect={connect}
                    localVideoRef={localVideoref}
                />
            ) : (
                <>
                    <VideoGrid
                        videos={videos}
                        localVideoRef={localVideoref}
                    />
                    
                    <MeetingControls
                        video={video}
                        audio={audio}
                        screen={screen}
                        screenAvailable={screenAvailable}
                        newMessages={newMessages}
                        onVideoToggle={handleVideo}
                        onAudioToggle={handleAudio}
                        onScreenToggle={handleScreen}
                        onEndCall={handleEndCall}
                        onChatToggle={handleChatToggle}
                        
                    />

                    <ChatPanel
                        isOpen={showChat}
                        onClose={() => setShowChat(false)}
                        messages={messages}
                        message={message}
                        setMessage={setMessage}
                        onSendMessage={handleSendMessage}
                    />
                </>
            )}
        </div>
    )
}