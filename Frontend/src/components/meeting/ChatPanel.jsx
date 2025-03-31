import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField, Button, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ChatPanel = ({ isOpen, onClose, messages, message, setMessage, onSendMessage }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-0 top-0 h-full w-80 bg-gray-900/90 backdrop-blur-sm border-l border-gray-800 shadow-xl"
        >
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Meeting Chat</h2>
              <IconButton onClick={onClose} className="text-gray-400 hover:text-white">
                <CloseIcon />
              </IconButton>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 rounded-lg p-3"
                  >
                    <p className="font-semibold text-orange-500">{item.sender}</p>
                    <p className="text-gray-300">{item.data}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No messages yet</p>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex space-x-2">
                <TextField
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
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
                  variant="contained"
                  onClick={onSendMessage}
                  sx={{
                    backgroundColor: 'rgb(249 115 22)',
                    '&:hover': {
                      backgroundColor: 'rgb(234 88 12)',
                    },
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel; 