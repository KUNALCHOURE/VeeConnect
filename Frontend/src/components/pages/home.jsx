import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/authecontext';
import { FaVideo, FaUserFriends, FaCalendarAlt, FaCog } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CTAButton from '../common/CTAButton';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: custom => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.15, duration: 0.6, ease: 'easeOut' }
    })
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
              <CTAButton
                to="/meeting/a"
                icon={FaVideo}
                label="New Meeting"
                className="px-8 py-3 text-lg rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold hover:scale-105 hover:shadow-2xl transition-all duration-300"
              />
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
    </div>
  );
};

export default HomePage;