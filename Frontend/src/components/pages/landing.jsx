import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaVideo, FaDesktop, FaComments, FaShieldAlt, FaUserFriends, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/authecontext';

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: <FaVideo className="w-8 h-8" />,
      title: "HD Video Calls",
      description: "Crystal clear video quality for seamless communication"
    },
    {
      icon: <FaDesktop className="w-8 h-8" />,
      title: "Screen Sharing",
      description: "Share your screen instantly with other participants"
    },
    {
      icon: <FaComments className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Built-in messaging for quick communication"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Secure Calls",
      description: "End-to-end encryption for your privacy"
    },
    {
      icon: <FaUserFriends className="w-8 h-8" />,
      title: "Group Calls",
      description: "Connect with multiple participants simultaneously"
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: "24/7 Available",
      description: "Access your meetings anytime, anywhere"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white">
      {/* Hero Section */}
      <div className=" h-screen container mx-auto flex flex-col-reverse md:flex-row items-center justify-evenly px-6 py-16 md:py-24">
        {/* Left Section - Text Content */}
        <motion.div 
          className="text-center md:text-left max-w-lg mt-20"
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
            <Link to={user ? "/home" : "/auth"} className="text-white no-underline">
              {user ? "Go to Dashboard" : "Get Started"}
            </Link>
          </motion.button>
        </motion.div>

        {/* Right Section - Animated Image */}
        <motion.div 
          className="flex justify-center mt-20"
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

      {/* Features Section */}
      <section className=" h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 p-6 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-orange-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    
     
    </div>
  );
}
