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
var connections = {};

export default function VideoMeeting() {
  const socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoRef = useRef();
  const videoRef = useRef([]);

  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [screen, setScreen] = useState(false);
  const [chat, setChat] = useState(false);
  const [newMessages, setNewMessages] = useState(0);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.mediaDevices.getDisplayMedia) {
      setScreenAvailable(true);
    }
    getUserMedia();
  }, []);

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
    navigate("/home");
  };

  const sendMessages = () => {
    socketRef.current.emit("chat-message", message);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Video Container */}
      <div className="flex flex-1 p-4 gap-4 justify-center">
        {/* Local Video */}
        <div className="relative w-1/3">
          <video ref={localVideoRef} autoPlay muted className="w-full h-full rounded-lg shadow-lg" />
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 text-sm rounded">
            You
          </span>
        </div>

        {/* Remote Videos */}
        <div className="flex flex-wrap gap-4 w-2/3">
          {videos.map((video) => (
            <div key={video.socketId} className="relative w-1/2">
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
                  className="w-full h-full rounded-lg shadow-lg"
                />
              ) : (
                <p className="text-center">Waiting for stream...</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <IconButton onClick={handleVideoClick} className=" bg-gray-700 p-3 rounded-lg hover:bg-gray-600">
          {video ? <VideocamIcon className="text-white"/> : <VideocamOffIcon className="text-white"/>}
        </IconButton>
        <IconButton onClick={handleMicClick} className="text-white bg-gray-700 p-3 rounded-lg hover:bg-gray-600">
          {audio ? <MicIcon  className="text-white"/> : <MicOffIcon className="text-white" />}
        </IconButton>
        {screenAvailable && (
          <IconButton onClick={handleScreenShare} className="text-white bg-gray-700 p-3 rounded-lg hover:bg-gray-600">
            {screen ? <CancelPresentationIcon  className="text-white"/> : <PresentToAllIcon  className="text-white"/>}
          </IconButton>
        )}
        <IconButton onClick={handleRaiseHand} className="text-white bg-gray-700 p-3 rounded-lg hover:bg-gray-600">
          <BackHandIcon className="text-white" />
        </IconButton>
        <IconButton onClick={handleEndCall} className=" bg-red-600 p-3 rounded-lg hover:bg-red-500">
          <CallEndIcon className="text-red-500" />
        </IconButton>
        <Badge badgeContent={newMessages} color="secondary">
          <IconButton onClick={handleChatToggle} className="text-white bg-gray-700 p-3 rounded-lg hover:bg-gray-600">
            <ChatIcon className="text-white"/>
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
