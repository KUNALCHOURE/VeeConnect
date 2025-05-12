import React from 'react';
import { motion } from 'framer-motion';
import { TextField, Button } from '@mui/material';
import { FaVideo } from 'react-icons/fa';

const MeetingLobby = ({ username, setUsername, onConnect, localVideoRef, meetingTitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <FaVideo className="text-orange-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {meetingTitle ? meetingTitle : "Join Meeting"}
          </h2>
          {meetingTitle && (
            <p className="text-gray-300 mb-2">Meeting Title: {meetingTitle}</p>
          )}
          <p className="text-gray-400">Enter your username to join the meeting</p>
        </div>

        <div className="space-y-4">
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgb(75 85 99)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgb(249 115 22)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(249 115 22)',
                },
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'rgb(156 163 175)',
                '&.Mui-focused': {
                  color: 'rgb(249 115 22)',
                },
              },
            }}
          />
          

          <Button
            fullWidth
            variant="contained"
            disabled={!username}
            onClick={onConnect}
            sx={{
              backgroundColor: 'rgb(249 115 22)',
              '&:hover': {
                backgroundColor: 'rgb(234 88 12)',
              },
              padding: '12px',
              fontSize: '1rem',
              '&.Mui-disabled': {
                backgroundColor: 'rgba(249, 115, 22, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)',
              }
            }}
          >
            Join Meeting
          </Button>
        </div>

        <div className="mt-8">
          <p className="text-gray-400 text-sm mb-2">Your camera preview:</p>
          <video
            className="w-full rounded-lg bg-gray-900"
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
          />
        </div>
      </motion.div>
    </div>
  );
};

export default MeetingLobby; 