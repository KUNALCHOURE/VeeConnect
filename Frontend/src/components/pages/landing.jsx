
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar.jsx";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white">
    
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 py-16 md:py-24">
        
        {/* Left Section - Text Content */}
        <motion.div 
          className="text-center md:text-left max-w-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="text-orange-500">Connect</span> with Your <br /> Loved Ones
          </h1>
          <p className="text-lg text-gray-300 mt-4">
            No matter the distance, stay close with seamless video calls.
          </p>
          
          <motion.button 
            className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg rounded-lg shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/home" className="text-white no-underline">
              Get Started
            </Link>
          </motion.button>
        </motion.div>

        {/* Right Section - Animated Image */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src="/video.png" 
            alt="Video Call" 
            className="w-80 md:w-[500px] drop-shadow-lg"
          />
        </motion.div>

      </div>
    </div>
  );
}
