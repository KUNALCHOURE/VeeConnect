import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/authecontext';
import { FaVideo, FaUserFriends, FaCalendarAlt, FaCog, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CTAButton from '../common/CTAButton';
import { v4 as uuidv4 } from 'uuid';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // States for modals
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [showJoinMeetingModal, setShowJoinMeetingModal] = useState(false);
  
  // Form states
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [username, setUsername] = useState(user?.username || "");

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: custom => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.15, duration: 0.6, ease: 'easeOut' }
    })
  };
  
  // Handle creating a new meeting
  const handleCreateMeeting = (e) => {
    e.preventDefault();
    
    // Generate a unique meeting ID
    const newMeetingId = uuidv4();
    
    // Navigate to meeting page with title and ID
    navigate(`/meeting?meetingId=${newMeetingId}&title=${encodeURIComponent(meetingTitle || "Untitled Meeting")}`);
  };
  
  // Handle joining an existing meeting
  const handleJoinMeeting = (e) => {
    e.preventDefault();
    
    if (!meetingId) {
      toast.error("Please enter a meeting ID");
      return;
    }
    
    // If user is not logged in, check if username is provided
    if (!user && !username) {
      toast.error("Please enter your name");
      return;
    }
    
    // Navigate to meeting page with ID and username if needed
    if (user) {
      navigate(`/meeting?meetingId=${meetingId}`);
    } else {
      navigate(`/meeting?meetingId=${meetingId}&username=${encodeURIComponent(username)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white relative">
      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="text-center py-16">
            <motion.h1
              custom={0}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500"
            >
              Welcome back, {user?.username || 'User'}!
            </motion.h1>
            <motion.p
              custom={1}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light"
            >
              Start or join a meeting in seconds
            </motion.p>
            <motion.div
              custom={2}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex justify-center space-x-6"
            >
              <button
                onClick={() => setShowNewMeetingModal(true)}
                className="flex items-center px-8 py-3 text-lg rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <FaVideo className="mr-2" />
                New Meeting
              </button>

              <button
                onClick={() => setShowJoinMeetingModal(true)}
                className="flex items-center px-8 py-3 text-lg rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <FaVideo className="mr-2" />
                Join Meeting
              </button>
            </motion.div>
          </section>

          {/* Cards Section */}
          <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Schedule Meeting Card */}
            <motion.div
              custom={3}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.035,
                boxShadow:
                  "0 12px 32px 0 rgba(255,156,16,0.14), 0 2px 4px 0 rgba(0,0,0,0.12)"
              }}
              className="relative p-8 rounded-2xl shadow-xl border border-orange-400/20
                bg-gradient-to-br from-[#212d49cc] via-[#1a2336cc] to-[#181f33cc]
                overflow-hidden backdrop-blur-lg transition-all duration-300 flex flex-col items-start"
            >
              {/* Icon Glow */}
              <span className="absolute -top-4 -left-4 w-24 h-24 z-0 rounded-full bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-600 opacity-20 blur-2xl" />
              {/* Grain overlay */}
              <span
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light z-30"
                style={{
                  backgroundImage:
                    "url(https://cdn.jsdelivr.net/gh/akzhy/Vintage-grain-overlay/vgrain.png)"
                }}
              />
              {/* Content */}
              <div className="relative z-10 flex flex-col items-start">
                <span className="mb-7 inline-flex items-center justify-center w-14 h-14 rounded-full
                   bg-gradient-to-tr from-orange-500 via-yellow-500 to-yellow-400 shadow-lg border-2 border-orange-400">
                  <FaCalendarAlt className="text-white text-2xl" />
                </span>
                <h3 className="text-2xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                  Schedule Meeting
                </h3>
                <p className="text-gray-200 mb-8 text-base">
                  Plan your next meeting with ease and precision.
                </p>
                <CTAButton
                  to="/schedule-meeting"
                  label="Schedule Now"
                  primary={false}
                  className="w-full rounded-xl border-2 border-orange-400 text-orange-400 font-semibold py-2 hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-yellow-500/30 transition"
                />
              </div>
            </motion.div>

            {/* View Contacts Card */}
            <motion.div
              custom={4}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.035,
                boxShadow:
                  "0 12px 32px 0 rgba(255,156,16,0.14), 0 2px 4px 0 rgba(0,0,0,0.12)"
              }}
              className="relative p-8 rounded-2xl shadow-xl border border-orange-400/20
                bg-gradient-to-br from-[#212d49cc] via-[#1a2336cc] to-[#181f33cc]
                overflow-hidden backdrop-blur-lg transition-all duration-300 flex flex-col items-start"
            >
              {/* Icon Glow */}
              <span className="absolute -top-4 -left-4 w-24 h-24 z-0 rounded-full bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-600 opacity-20 blur-2xl" />
              {/* Grain overlay */}
              <span
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light z-30"
                style={{
                  backgroundImage:
                    "url(https://cdn.jsdelivr.net/gh/akzhy/Vintage-grain-overlay/vgrain.png)"
                }}
              />
              {/* Content */}
              <div className="relative z-10 flex flex-col items-start">
                <span className="mb-7 inline-flex items-center justify-center w-14 h-14 rounded-full
                   bg-gradient-to-tr from-orange-500 via-yellow-500 to-yellow-400 shadow-lg border-2 border-orange-400">
                  <FaUserFriends className="text-white text-2xl" />
                </span>
                <h3 className="text-2xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                  View Contacts
                </h3>
                <p className="text-gray-200 mb-8 text-base">
                  Manage your contacts and teams effortlessly.
                </p>
                <CTAButton
                  to="/contacts"
                  label="View Contacts"
                  primary={false}
                  className="w-full rounded-xl border-2 border-orange-400 text-orange-400 font-semibold py-2 hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-yellow-500/30 transition"
                />
              </div>
            </motion.div>

            {/* Settings Card */}
            <motion.div
              custom={5}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              whileHover={{
                scale: 1.035,
                boxShadow:
                  "0 12px 32px 0 rgba(255,156,16,0.14), 0 2px 4px 0 rgba(0,0,0,0.12)"
              }}
              className="relative p-8 rounded-2xl shadow-xl border border-orange-400/20
                bg-gradient-to-br from-[#212d49cc] via-[#1a2336cc] to-[#181f33cc]
                overflow-hidden backdrop-blur-lg transition-all duration-300 flex flex-col items-start"
            >
              {/* Icon Glow */}
              <span className="absolute -top-4 -left-4 w-24 h-24 z-0 rounded-full bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-600 opacity-20 blur-2xl" />
              {/* Grain overlay */}
              <span
                className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light z-30"
                style={{
                  backgroundImage:
                    "url(https://cdn.jsdelivr.net/gh/akzhy/Vintage-grain-overlay/vgrain.png)"
                }}
              />
              {/* Content */}
              <div className="relative z-10 flex flex-col items-start">
                <span className="mb-7 inline-flex items-center justify-center w-14 h-14 rounded-full
                   bg-gradient-to-tr from-orange-500 via-yellow-500 to-yellow-400 shadow-lg border-2 border-orange-400">
                  <FaCog className="text-white text-2xl" />
                </span>
                <h3 className="text-2xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
                  Settings
                </h3>
                <p className="text-gray-200 mb-8 text-base">
                  Customize your experience to suit your needs.
                </p>
                <CTAButton
                  to="/profile"
                  label="Go to Settings"
                  primary={false}
                  className="w-full rounded-xl border-2 border-orange-400 text-orange-400 font-semibold py-2 hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-yellow-500/30 transition"
                />
              </div>
            </motion.div>
          </section>
        </div>
      </main>
      
      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Start a New Meeting</h2>
              <button 
                onClick={() => setShowNewMeetingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Enter meeting title (optional)"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 rounded-md font-semibold text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Start Meeting
              </button>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Join Meeting Modal */}
      {showJoinMeetingModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Join a Meeting</h2>
              <button 
                onClick={() => setShowJoinMeetingModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleJoinMeeting} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Meeting ID
                </label>
                <input
                  type="text"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  placeholder="Enter meeting ID"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {!user && (
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              
              <button
                type="submit"
                className="w-full py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Join Meeting
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;