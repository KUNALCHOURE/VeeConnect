import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/authecontext';
import { FaVideo, FaUsers, FaCalendarAlt, FaUserFriends, FaCog } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import HeaderMenu from '../common/HeaderMenu';
import CTAButton from '../common/CTAButton';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMeetingsDropdownOpen, setIsMeetingsDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white">
      {/* Main Content */}
      <main className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="text-center py-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500"
            >
              Welcome back, {user?.fullname || 'User'}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              Start or join a meeting in seconds
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center space-x-4"
            >
              <CTAButton
                to="/new-meeting"
                icon={FaVideo}
                label="New Meeting"
              />
              <CTAButton
                to="/join-meeting"
                icon={FaUsers}
                label="Join Meeting"
                primary={false}
              />
            </motion.div>
          </section>

          {/* Quick Actions Section */}
          <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FaCalendarAlt className="text-orange-500 text-2xl" />
                <h3 className="text-lg font-semibold text-white">Schedule Meeting</h3>
              </div>
              <p className="text-gray-400 mb-4">Plan your next meeting with ease</p>
              <CTAButton
                to="/schedule-meeting"
                label="Schedule Now"
                primary={false}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FaUserFriends className="text-orange-500 text-2xl" />
                <h3 className="text-lg font-semibold text-white">View Contacts</h3>
              </div>
              <p className="text-gray-400 mb-4">Manage your contacts and teams</p>
              <CTAButton
                to="/contacts"
                label="View Contacts"
                primary={false}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FaCog className="text-orange-500 text-2xl" />
                <h3 className="text-lg font-semibold text-white">Settings</h3>
              </div>
              <p className="text-gray-400 mb-4">Customize your experience</p>
              <CTAButton
                to="/profile"
                label="Go to Settings"
                primary={false}
              />
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;