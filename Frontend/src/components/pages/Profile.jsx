import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/authecontext';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
              <FaUser className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;