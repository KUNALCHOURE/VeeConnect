import React from 'react';
import { motion } from 'framer-motion';
import { IconButton, Badge } from '@mui/material';
import {
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

const MeetingControls = ({
  video,
  audio,
  screen,
  screenAvailable,
  newMessages,
  onVideoToggle,
  onAudioToggle,
  onScreenToggle,
  onEndCall,
  onChatToggle,
  onSendMessage,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-center items-center space-x-6">
          <IconButton
            onClick={onVideoToggle}
            className="bg-gray-700 hover:bg-gray-600"
            size="large"
          >
            {video ? <VideocamIcon fontSize="large" style={{ color: 'white' }} /> : <VideocamOffIcon fontSize="large" style={{ color: 'white' }} />}
          </IconButton>

          <IconButton
            onClick={onAudioToggle}
            className="bg-gray-700 hover:bg-gray-600"
            size="large"
          >
            {audio ? <MicIcon fontSize="large" style={{ color: 'white' }} /> : <MicOffIcon fontSize="large" style={{ color: 'white' }} />}
          </IconButton>

          {screenAvailable && (
            <IconButton
              onClick={onScreenToggle}
              className="bg-gray-700 hover:bg-gray-600"
              size="large"
            >
              {!screen ? <ScreenShareIcon fontSize="large" style={{ color: 'white' }} /> : <StopScreenShareIcon fontSize="large" style={{ color: 'white' }} />}
            </IconButton>
          )}

          <IconButton
            onClick={onChatToggle}
            className="bg-gray-700 hover:bg-gray-600"
            size="large"
          >
            <Badge badgeContent={newMessages} color="error">
              <ChatIcon fontSize="large" style={{ color: 'white' }} />
            </Badge>
          </IconButton>

          <IconButton
            onClick={onEndCall}
            className="bg-red-700 hover:bg-red-800 text-red-400"
            size="large"
          >
            <CallEndIcon fontSize="large" style={{ color: 'white' }} />
          </IconButton>
        </div>
      </div>
    </motion.div>
  );
};

export default MeetingControls;