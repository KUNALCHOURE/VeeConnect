import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const VideoGrid = ({ videos, localVideoRef }) => {
  // Calculate grid layout based on number of participants
  const getGridLayout = () => {
    const totalVideos = videos.length + 1; // +1 for local video
    
    if (totalVideos <= 1) {
      return "grid-cols-1";
    } else if (totalVideos <= 4) {
      return "grid-cols-1 md:grid-cols-2";
    } else {
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };
  
  // Attach video streams to elements
  const attachStream = (ref, stream) => {
    if (!ref || !stream) return;
    
    // Only set srcObject if it's not already set to the same stream
    if (ref.srcObject !== stream) {
      console.log('Attaching stream to video element');
      ref.srcObject = stream;
      ref.play().catch(e => console.log('Error playing video:', e));
    }
  };

  return (
    <div className={`grid ${getGridLayout()} gap-4 p-4`}>
      {/* Local Video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl"
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded-full text-white text-sm font-medium">
          You
        </div>
      </motion.div>

      {/* Remote Videos */}
      {videos.map((video) => (
        <motion.div
          key={video.socketId}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl"
        >
          <video
            data-socket={video.socketId}
            ref={(ref) => {
              if (ref && video.stream) {
                attachStream(ref, video.stream);
              }
            }}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/70 px-3 py-1 rounded-full text-white text-sm font-medium">
            {video.username || 'Participant'}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VideoGrid; 