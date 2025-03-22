import React, { useEffect, useRef, useState } from "react";
import { IconButton, Badge, Button, TextField } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import BackHandIcon from "@mui/icons-material/BackHand";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const server_url = "http://localhost:3000";

export default function VideoMeeting({ videos, setinmeeting }) {
  const socketRef = useRef();
  const localVideoRef = useRef();
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [screen, setScreen] = useState(false);
  const [chat, setChat] = useState(false);
  const [newMessages, setNewMessages] = useState(0);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [avideos, setVideos] = useState(videos);
  const [clicked, setClicked] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [testVideos, setTestVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.mediaDevices.getDisplayMedia) {
      setScreenAvailable(true);
    }
    getUserMedia();
  }, []);
  // useEffect(() => {
  //   async function getTestStream() {
  //     try {
  //       const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

  //       // Simulate a user video object
  //       setTestVideos([{ socketId: "test-user", stream: localStream }]);
  //     } catch (error) {
  //       console.error("Error accessing media devices:", error);
  //     }
  //   }
    
  //   getTestStream();
  // }, []);

  const getUserMedia = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (userStream) {
        window.localStream = userStream;
        localVideoRef.current.srcObject = userStream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleVideoClick = () => setVideo((prev) => !prev);
  const handleMicClick = () => setAudio((prev) => !prev);
  const handleScreenShare = () => setScreen((prev) => !prev);
  const handleChatToggle = () => setChat((prev) => !prev);
  const handleRaiseHand = () => setClicked((prev) => !prev);

  const handleEndCall = () => {
    try {
      const tracks = localVideoRef.current?.srcObject?.getTracks();
      if (tracks) {
        tracks.forEach((track) => track.stop());
      }
      socketRef.current.disconnect();
      localVideoRef.current.srcObject = null;
      setVideos([]);
    } catch (error) {
      console.error("Error cleaning up media and connections:", error);
    }
    setinmeeting(false);
    navigate("/home");
  };

  const sendMessages = () => {
    socketRef.current.emit("chat-message", message);
    setMessage("");
  };

  const getVideoGridClass = (count) => {
    if (count === 1) return "grid grid-cols-1  place-items-center"; // 🟢 Center single user
    if (count === 2) return "grid grid-cols-2 h-screen"; // Two users side by side
    if (count <= 4) return "grid grid-cols-2 grid-rows-2 h-screen"; // 2x2 Grid
    if (count <= 6) return "grid grid-cols-3 grid-rows-2 h-screen"; // 3x2 Grid
    return "grid grid-cols-4 grid-rows-3 h-screen"; // More than 6 users (4x3 Grid)
  };
  

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Video Container */}
      <div className="flex flex-1 p-4 gap-4 justify-center">
        {/* Remove Local Video for Testing */}
        {/* <div className="relative w-1/3">
          <video ref={localVideoRef} autoPlay muted className="w-full h-full rounded-lg shadow-lg" />
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 text-sm rounded">
            You
          </span>
        </div> */}

        <div className={`grid gap-4 w-full ${getVideoGridClass(avideos.length)}`}>
        {avideos.map((video, index) => (
  <div
    key={video.socketId}
    className={`relative ${
      testVideos.length === 1 ? " flex items-center justify-center" : "w-full h-full"
    }`}
  >
    {video.stream ? (
      <video
        ref={(ref) => {
          if (ref && ref.srcObject !== video.stream) {
            ref.srcObject = video.stream;
          }
        }}
        autoPlay
        playsInline
        muted
        className={`rounded-lg shadow-lg object-cover `} // 🟢 Fullscreen if 1 user
      />
    ) : (
      <p className="text-center">Waiting for stream...</p>
    )}
  </div>
))}

        </div>
      </div>
      {/* Controls */}
      <div className="flex justify-center space-x-6 p-4 bg-gray-800 rounded-lg shadow-lg">
        <IconButton
          onClick={handleVideoClick}
          className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out shadow-sm"
          title="Toggle Video"
        >
          {video ? <VideocamIcon className="text-white" fontSize="large" /> : <VideocamOffIcon className="text-white" fontSize="large" />}
        </IconButton>
        <IconButton
          onClick={handleMicClick}
          className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out shadow-sm"
          title="Toggle Microphone"
        >
          {audio ? <MicIcon className="text-white" fontSize="large" /> : <MicOffIcon className="text-white" fontSize="large" />}
        </IconButton>
        {screenAvailable && (
          <IconButton
            onClick={handleScreenShare}
            className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out shadow-sm"
            title="Share Screen"
          >
            {screen ? <CancelPresentationIcon className="text-white" fontSize="large" /> : <PresentToAllIcon className="text-white" fontSize="large" />}
          </IconButton>
        )}
        <IconButton
          onClick={handleRaiseHand}
          className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out shadow-sm"
          title="Raise Hand"
        >
          <BackHandIcon className="text-white" fontSize="large" />
        </IconButton>
        <IconButton
          onClick={handleEndCall}
          className="bg-red-600 p-3 rounded-full hover:bg-red-500 transition duration-300 ease-in-out shadow-sm"
          title="End Call"
        >
          <CallEndIcon className="text-white" fontSize="large" />
        </IconButton>
        <Badge badgeContent={newMessages} color="secondary">
          <IconButton
            onClick={handleChatToggle}
            className="bg-gray-700 p-3 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out shadow-sm"
            title="Toggle Chat"
          >
            <ChatIcon className="text-white" fontSize="large" />
          </IconButton>
        </Badge>
      </div>

      {/* Chat Box */}
      {chat && (
        <div className="absolute bottom-16 right-4 w-80 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h1 className="text-lg font-bold text-center">Chats</h1>
          <div className="h-40 overflow-y-auto p-2">
            {messages.map((item, index) => (
              <div key={index} className="mb-2 p-2 bg-gray-700 rounded-lg">
                <p className="text-sm font-bold">{item.sender}</p>
                <p>{item.data}</p>
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              label="Enter Message"
              variant="filled"
              fullWidth
              className="bg-gray-700 text-white"
            />
            <Button onClick={sendMessages} className="bg-orange-500 hover:bg-orange-600 text-white ml-2">
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}