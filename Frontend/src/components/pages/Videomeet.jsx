import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import MeetingLobby from '../meeting/MeetingLobby';
import MeetingControls from '../meeting/MeetingControls';
import ChatPanel from '../meeting/ChatPanel';
import VideoGrid from '../meeting/VideoGrid';
import { v4 as uuidv4 } from 'uuid';
import api from '../../utils/api'; // Adjust the path to your api file
import { useAuth } from '../../context/authecontext';

const SOCKET_SERVER_URL = "http://localhost:3000";

const WEBRTC_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

// Store active peer connections
let peerConnections = {};

export default function VideoMeetComponent({setinmeeting}) {
    // Refs
    const meetingSocketRef = useRef();
    const currentUserSocketIdRef = useRef();
    const localVideoElementRef = useRef();
    const remoteVideosRef = useRef([]);

    // State
    const [isVideoDeviceAvailable, setIsVideoDeviceAvailable] = useState(true);
    const [isAudioDeviceAvailable, setIsAudioDeviceAvailable] = useState(true);
    const [isScreenSharingAvailable, setIsScreenSharingAvailable] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isScreenSharingEnabled, setIsScreenSharingEnabled] = useState(false);
    const [remoteVideoStreams, setRemoteVideoStreams] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
    const [showUsernamePrompt, setShowUsernamePrompt] = useState(true);
    const [currentUsername, setCurrentUsername] = useState("");
    const [meetingRoomId, setMeetingRoomId] = useState(null);
    const [meetingParticipants, setMeetingParticipants] = useState([]);
    const {user} = useAuth();
    const [meetingRoomTitle, setMeetingRoomTitle] = useState("");

    // Initialize meeting ID from URL or generate a new one
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('meetingId');
        const urlTitle = urlParams.get('title');
        const urlUsername = urlParams.get('username');
        
        if (id) {
            setMeetingRoomId(id);
        } else {
            const newId = uuidv4();
            setMeetingRoomId(newId);
            window.history.replaceState(null, null, `?meetingId=${newId}`);
        }
        
        if (urlTitle) {
            setMeetingRoomTitle(urlTitle);
        }
        
        if (urlUsername && !user?.username) {
            setCurrentUsername(urlUsername);
            setShowUsernamePrompt(false);
        }
        
        requestMediaPermissions();
    }, [user]);

    const startScreenSharing = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            handleStreamSuccess(screenStream, true);
        } catch (e) {
            console.log("Error accessing display media: ", e);
        }
    };
// this function is for requesting media permission from the user
    const requestMediaPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setIsVideoDeviceAvailable(true);
                setIsVideoEnabled(true);
            } else {
                setIsVideoDeviceAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setIsAudioDeviceAvailable(true);
                setIsAudioEnabled(true);
            } else {
                setIsAudioDeviceAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setIsScreenSharingAvailable(true);
            } else {
                setIsScreenSharingAvailable(false);
            }

            if (isVideoDeviceAvailable || isAudioDeviceAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: isVideoDeviceAvailable, 
                    audio: isAudioDeviceAvailable 
                });
                
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    
                    userMediaStream.getTracks().forEach(track => {
                        track.enabled = true;
                    });
                    
                    if (localVideoElementRef.current) {
                        localVideoElementRef.current.srcObject = userMediaStream;
                        localVideoElementRef.current.play().catch(e => {   //.play is used to start playback of the video
                            console.log('Error playing video:', e);
                        });
                    }
                }
            }
        } catch (error) {
            console.log('Error in requestMediaPermissions:', error);
        }
    };

      // this effect run when the video or audio is enable ot disabble to update the local stream
    useEffect(() => {
        if (isVideoEnabled !== undefined && isAudioEnabled !== undefined) {
            captureUserMedia();
        }
    }, [isVideoEnabled, isAudioEnabled]); 

    // this is called when th user joins the meeting from looby and it sets the video and audio states based on the device available the connects 
    // to socket.io server
    const initializeMedia = () => {
        setIsVideoEnabled(isVideoDeviceAvailable);
        setIsAudioEnabled(isAudioDeviceAvailable);
        connectToSocketServer();
    };

    // it process a nw media stream when it successfully obtained from the user
    const handleUserMediaSuccess = (stream) => {
        try { 
            // stop the old media stream to clean up old streams before replacing them. Catches and logs any errors.
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) { console.log(e) }

        window.localStream = stream;
        localVideoElementRef.current.srcObject = stream;

        //loops to add the new stream to the peer connections
        for (let id in peerConnections) {
            if (id === currentUserSocketIdRef.current) continue;

            peerConnections[id].addStream(window.localStream);
// initaite the webrtc connection and create an offer
            peerConnections[id].createOffer().then((description) => {
                peerConnections[id].setLocalDescription(description)
                    .then(() => {
                        meetingSocketRef.current.emit('signal', id, JSON.stringify({ 'sdp': peerConnections[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            });
        }
//Attaches an onended event listener to each track in the stream. If a track ends, it disables the video and audio and stops the local stream.
        stream.getTracks().forEach(track => track.onended = () => {
            setIsVideoEnabled(false);
            setIsAudioEnabled(false);

            try {
                // stops the local video and audio tracks
                let tracks = localVideoElementRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { console.log(e) }
// create a new media stream with black and silence tracks to replace the old one
            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoElementRef.current.srcObject = window.localStream;

// Loops through all peer connections, adds the placeholder stream to each, and re-negotiates by creating and sending a new offer. This ensures peers see a blank video and hear silence instead of a broken stream.
            for (let id in peerConnections) {
                peerConnections[id].addStream(window.localStream);

                peerConnections[id].createOffer().then((description) => {
                    peerConnections[id].setLocalDescription(description)
                        .then(() => {
                            meetingSocketRef.current.emit('signal', id, JSON.stringify({ 'sdp': peerConnections[id].localDescription }));
                        })
                        .catch(e => console.log(e));
                });
            }
        });
    };
//captureUserMedia, which fetches a new media stream based on current video/audio toggle states
    const captureUserMedia = () => {
        if ((isVideoEnabled && isVideoDeviceAvailable) || (isAudioEnabled && isAudioDeviceAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: isVideoEnabled, audio: isAudioEnabled })
                .then((stream) => {
                    // enables all tracks in the new stream
                    stream.getTracks().forEach(track => {
                        track.enabled = true;
                    });

                    handleStreamSuccess(stream, false);
                    
                    if (localVideoElementRef.current) {
                        localVideoElementRef.current.srcObject = stream;
                        localVideoElementRef.current.play().catch(e => {
                            console.log('Error playing video:', e);
                        });
                    }
                })
                .catch((e) => console.log("Error accessing user media: ", e));
        } else {
            try {
                if (localVideoElementRef.current && localVideoElementRef.current.srcObject) {
                    let tracks = localVideoElementRef.current.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                }
            } catch (e) {
                console.log(e);
            }
        }
    };
//handleStreamSuccess, which updates the local stream(camera, mic, or screen) and notifying peers and its tracks when a new stream is successfully obtained
    const handleStreamSuccess = (stream, isScreen = false) => {
        try {
            // Stops all tracks of the existing window.localStream to clean up before replacing it
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        } catch (e) {
            console.log('Error stopping old tracks:', e);
        }
    
        window.localStream = stream;
        
        stream.getTracks().forEach(track => {
            track.enabled = true;
        });
        
        if (localVideoElementRef.current) {
            localVideoElementRef.current.srcObject = stream;
            localVideoElementRef.current.play().catch(e => {
                console.log('Error playing video:', e);
            });
        }
    // loops through all peer connections, removes the old stream, adds the new stream, and creates a new offer to notify peers of the change
        for (let id in peerConnections) {
            if (id === currentUserSocketIdRef.current) continue;
    
            try {
                peerConnections[id].removeStream(window.localStream);
                peerConnections[id].addStream(stream);
    
                peerConnections[id].createOffer().then((description) => {
                    peerConnections[id].setLocalDescription(description)
                        .then(() => {
                            meetingSocketRef.current.emit('signal', id, JSON.stringify({ 'sdp': peerConnections[id].localDescription }));
                        })
                        .catch(e => console.log('Error setting local description:', e));
                });
            } catch (e) {
                console.log('Error updating peer connection:', e);
            }
        }
    //Sets an onended listener on each track. If the track ends and it's a screen-sharing stream (isScreen = true), it toggles off screen sharing and switches back to the camera/mic stream by calling captureUserMedia()
        stream.getTracks().forEach(track => {
            if (track) {
                track.onended = () => {
                    if (isScreen) {
                        setIsScreenSharingEnabled(false);
                        setIsScreenSharingAvailable(true);
                        captureUserMedia();
                    }
                };
            }
        });
    };

//handleSignalingMessage, which processes incoming signaling messages from other users
    const handleSignalingMessage = (fromId, message) => {
        var signal = JSON.parse(message);
//ignore messages from the current user
        if (fromId !== currentUserSocketIdRef.current) {
            if (signal.sdp) {  // if the message contains an SDP (Session Description Protocol)
                //
                peerConnections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        peerConnections[fromId].createAnswer().then((description) => {
                            peerConnections[fromId].setLocalDescription(description).then(() => {
                                meetingSocketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': peerConnections[fromId].localDescription }));
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            }

            if (signal.ice) {
                peerConnections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    };
//addMessage, which adds a new chat message to the chat history
    const addMessage = (data, sender, socketIdSender) => {
        setChatMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        // if the message is not from the current user, increment the unread message count
        if (socketIdSender !== currentUserSocketIdRef.current) {
            setUnreadMessageCount((prevCount) => prevCount + 1);
        }
    };
//connectToSocketServer, which establishes a connection to the socket.io server
    const connectToSocketServer = () => {
        // connects to the socket.io server at the specified URL
        meetingSocketRef.current = io.connect(SOCKET_SERVER_URL, { secure: false });
        // listens for incoming signaling messages from other users
        meetingSocketRef.current.on('signal', handleSignalingMessage);
    //Listens for the connect event, which fires once the Socket.IO connection is established.
        meetingSocketRef.current.on('connect', () => {
            // emits a join-call event to the server with the meeting room ID, user ID, and current username
            meetingSocketRef.current.emit('join-call', meetingRoomId, user?._id || null, currentUsername);

            // it store the  socket id assigned by server for current user in ref
            currentUserSocketIdRef.current = meetingSocketRef.current.id;

            // listens for incoming chat messages and adds them to the chat history
            meetingSocketRef.current.on('chat-message', addMessage);

            // listens for the user-left event, which fires when a user leaves the call. It removes the user's video stream and participant from the list
            meetingSocketRef.current.on('user-left', (id) => {

                // it remove there video from remotestream and entry from meeting participants list
                setRemoteVideoStreams((streams) => streams.filter((video) => video.socketId !== id));
                setMeetingParticipants(prevParticipants => 
                    prevParticipants.filter(p => p.socketId !== id)
                );
            });
     // this is send by the backend when the frontend send the joinsignal connection 
            meetingSocketRef.current.on('user-joined', (id, clients, joiningUsername, joiningUserId) => {
                const newUserName = joiningUsername || "Guest";
                // this add the user it meeting particiant list  if they didint exist before 
                setMeetingParticipants(prevParticipants => {
                    const userExists = prevParticipants.some(p => p.socketId === id);
                    if (!userExists) {
                        return [...prevParticipants, { 
                            socketId: id, 
                            username: newUserName,
                            userId: joiningUserId || null
                        }];
                    }
                    return prevParticipants;
                });
                

                // this loops through all the socketid in the clients array and setup new rtc connection for each user
                clients.forEach((socketListId) => {
                    peerConnections[socketListId] = new RTCPeerConnection(WEBRTC_CONFIG);
                    //onicecandidate handler to send ICE candidates to the peer via a signal event when they are discovered.
                    peerConnections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            meetingSocketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    };
    //Sets up an onaddstream handler to process incoming streams from the peer:
                    peerConnections[socketListId].onaddstream = (event) => {

                        // checks if the video already exists in the remoteVideosRef.current array
                        let videoExists = remoteVideosRef.current.find(video => video.socketId === socketListId);
                        // if the video exists, update the stream and username
                        if (videoExists) {
                            setRemoteVideoStreams(streams => {
                                const updatedStreams = streams.map(video =>
                                    video.socketId === socketListId ? { 
                                        ...video, 
                                        stream: event.stream,
                                        username: meetingParticipants.find(p => p.socketId === socketListId)?.username || "Guest"
                                    } : video
                                );
                                remoteVideosRef.current = updatedStreams;
                                return updatedStreams;
                            });
                        } else {
                            //if video does not exist, create a new video entry
                            const participant = meetingParticipants.find(p => p.socketId === socketListId);
                            
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true,
                                username: participant?.username || "Guest"
                            };

                            setRemoteVideoStreams(streams => {
                                const updatedStreams = [...streams, newVideo];
                                remoteVideosRef.current = updatedStreams;
                                return updatedStreams;
                            });
                        }
                    };
    // add local stream to the peer connection if it exists, otherwise create a new local stream with black and silence tracks
                    if (window.localStream) {
                        peerConnections[socketListId].addStream(window.localStream);
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        peerConnections[socketListId].addStream(window.localStream);
                    }
                });
    //f the joining user is the current user (id === currentUserSocketIdRef.current), loops through existing peer connections, adds the local stream, and initiates WebRTC negotiation by creating and sending an offer via a signal event.
                if (id === currentUserSocketIdRef.current) {
                    for (let id2 in peerConnections) {
                        if (id2 === currentUserSocketIdRef.current) continue;
    
                        try {
                            peerConnections[id2].addStream(window.localStream);
                        } catch (e) { }
    
                        peerConnections[id2].createOffer().then((description) => {
                            peerConnections[id2].setLocalDescription(description)
                                .then(() => {
                                    meetingSocketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': peerConnections[id2].localDescription }));
                                })
                                .catch(e => console.log(e));
                        });
                    }
                }
            });
        });
    };

    const silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    };

    const black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    };


    //toggleVideo, which toggles the video stream on and off
    const toggleVideo = async () => {
        setIsVideoEnabled((prevVideo) => {
            const newVideoState = !prevVideo;
            // if the new video state is true, it requests a new media stream with video enabled
            if (newVideoState) {
                navigator.mediaDevices.getUserMedia({ video: true, audio: isAudioEnabled })
                    .then((stream) => {
                        if (window.localStream) {
                            window.localStream.getTracks().forEach(track => track.stop());
                        }
                        // updates the local stream with the new video stream
                        window.localStream = stream;
                        if (localVideoElementRef.current) {
                            localVideoElementRef.current.srcObject = stream;
                        }
                        // loops through all peer connections, removes the old stream, adds the new stream, and creates a new offer to notify peers of the change
                        for (let id in peerConnections) {
                            if (id === currentUserSocketIdRef.current) continue;

                            try {
                                peerConnections[id].removeStream(window.localStream);
                                peerConnections[id].addStream(stream);

                                peerConnections[id].createOffer().then((description) => {
                                    peerConnections[id].setLocalDescription(description)
                                        .then(() => {
                                            meetingSocketRef.current.emit('signal', id, JSON.stringify({ 'sdp': peerConnections[id].localDescription }));
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
                //Creates a black video stream using the black helper.
                const blackStream = new MediaStream([black()]);
                
                if (window.localStream) {
                    window.localStream.getTracks().forEach(track => {
                        if (track.kind === 'video') {
                            track.stop();
                        }
                    });
                }
                
                window.localStream = blackStream;
                if (localVideoElementRef.current) {
                    localVideoElementRef.current.srcObject = blackStream;
                }

                for (let id in peerConnections) {
                    if (id === currentUserSocketIdRef.current) continue;

                    try {
                        peerConnections[id].removeStream(window.localStream);
                        peerConnections[id].addStream(blackStream);

                        peerConnections[id].createOffer().then((description) => {
                            peerConnections[id].setLocalDescription(description)
                                .then(() => {
                                    meetingSocketRef.current.emit('signal', id, JSON.stringify({ 'sdp': peerConnections[id].localDescription }));
                                })
                                .catch(e => console.log('Error setting local description:', e));
                        });
                    } catch (e) {
                        console.log('Error updating peer connection:', e);
                    }
                }
            }
            // Returns the new toggled state for isVideoEnabled.
            return newVideoState;
        });
    };
    //toggleAudio, which toggles the audio stream on and off
    const toggleAudio = () => {
        setIsAudioEnabled((prevAudio) => {
            const newAudioState = !prevAudio;
            if (window.localStream) {
                window.localStream.getAudioTracks().forEach(track => track.enabled = newAudioState);
            }
            return newAudioState;
        });
    };

    //toggleScreenSharing, which toggles screen sharing on and off
    const toggleScreenSharing = () => {
        setIsScreenSharingEnabled((prevScreen) => {
            const newScreenState = !prevScreen;
            if (newScreenState) {
                startScreenSharing();
            } else {
                captureUserMedia();
            }
            return newScreenState;
        });
    };

    //endMeeting, which ends the meeting by stopping all media streams, disconnecting from the server, and redirecting to the home page
    const endMeeting = async () => {
        try {

            // stops the local video stream
            if (localVideoElementRef.current && localVideoElementRef.current.srcObject) {
                localVideoElementRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            // stops the remote video streams
            remoteVideoStreams.forEach(video => {
                if (video.stream) {
                    video.stream.getTracks().forEach(track => track.stop());
                }
            });

            // disconnects from the server
            if (meetingSocketRef.current) {
                meetingSocketRef.current.disconnect();
            }
            // closes all webrtc connections and set the peerconnections object to an empty object
            Object.values(peerConnections).forEach(connection => {
                connection.close();
            });
            peerConnections = {};

            // sets the inmeeting state to false
            setinmeeting(false);
            // redirects to the home page
            window.location.href = "/";
        } catch (error) {
            //Mirrors the cleanup process in the endMeeting function.
            console.error('Error ending call:', error);
            if (localVideoElementRef.current && localVideoElementRef.current.srcObject) {
                localVideoElementRef.current.srcObject.getTracks().forEach(track => track.stop());
            }

            remoteVideoStreams.forEach(video => {
                if (video.stream) {
                    video.stream.getTracks().forEach(track => track.stop());
                }
            });

            if (meetingSocketRef.current) {
                meetingSocketRef.current.disconnect();
            }

            Object.values(peerConnections).forEach(connection => {
                connection.close();
            });
            peerConnections = {};

            setinmeeting(false);
            window.location.href = "/";
        }
    };

    //toggleChatPanel, which toggles the chat panel on and off
    const toggleChatPanel = () => setIsChatPanelOpen(!isChatPanelOpen);

    //sendChatMessage, which sends a chat message to the server
    const sendChatMessage = () => {
        meetingSocketRef.current.emit('chat-message', currentMessage, currentUsername);
        setCurrentMessage("");  //reset the message input field
    };

    //joinMeeting, called when the user clicks "Join" from the lobby.
    const joinMeeting = () => {
        setShowUsernamePrompt(false);
        setinmeeting(true);
        
        //dds the current user to the meetingParticipants list with their socket ID (though it might not be set yet), username, and user ID if authenticated.
        setMeetingParticipants(prevParticipants => [...prevParticipants, {
            socketId: currentUserSocketIdRef.current,
            username: currentUsername,
            userId: user?._id || null
        }]);
        // then calls the initializeMedia function to set up the media streams and connect to socket.io server
        initializeMedia();
    };
//useEffect that runs whenever meetingParticipants changes
    useEffect(() => {

        //: Updates the remoteVideoStreams state to ensure each video object has the correct username from the meetingParticipants list, defaulting to "Guest" if not found. This syncs participant names with their video feeds.
        if (remoteVideoStreams.length > 0 && meetingParticipants.length > 0) {
            setRemoteVideoStreams(prevStreams => {
                return prevStreams.map(video => {
                    const participant = meetingParticipants.find(p => p.socketId === video.socketId);
                    if (participant) {
                        return {
                            ...video,
                            username: participant.username || 'Guest'
                        };
                    }
                    return video;
                });
            });
        }
    }, [meetingParticipants]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900">
            {showUsernamePrompt ? (
                <MeetingLobby
                    username={currentUsername}
                    setUsername={setCurrentUsername}
                    onConnect={joinMeeting}
                    localVideoRef={localVideoElementRef}
                    meetingTitle={meetingRoomTitle}
                />
            ) : (
                <>

                {/* for solving the videogrid problem we have to change dtyling in this we have to create a new div and then
                add videogrid and meetincontrols in one div for handling the videogrid problem  */}
                    <VideoGrid
                        videos={remoteVideoStreams}
                        localVideoRef={localVideoElementRef}
                    />
                    
                    <MeetingControls
                        video={isVideoEnabled}
                        audio={isAudioEnabled}
                        screen={isScreenSharingEnabled}
                        screenAvailable={isScreenSharingAvailable}
                        newMessages={unreadMessageCount}
                        onVideoToggle={toggleVideo}
                        onAudioToggle={toggleAudio}
                        onScreenToggle={toggleScreenSharing}
                        onEndCall={endMeeting}
                        onChatToggle={toggleChatPanel}
                    />

                    <ChatPanel
                        isOpen={isChatPanelOpen}
                        onClose={() => setIsChatPanelOpen(false)}
                        messages={chatMessages}
                        message={currentMessage}
                        setMessage={setCurrentMessage}
                        onSendMessage={sendChatMessage}
                    />
                </>
            )}
        </div>
    );
}