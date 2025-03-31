import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaVideo, 
  FaUserFriends, 
  FaCog, 
  FaChevronDown,
  FaSignOutAlt
} from 'react-icons/fa';

const HeaderMenu = ({ 
  isMeetingsDropdownOpen, 
  setIsMeetingsDropdownOpen,
  isSettingsDropdownOpen,
  setIsSettingsDropdownOpen,
  onLogout 
}) => {
  return (
    <nav className="flex items-center space-x-4">
      {/* Meetings Dropdown */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMeetingsDropdownOpen(!isMeetingsDropdownOpen)}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
        >
          <FaVideo className="text-lg" />
          <span>Meetings</span>
          <FaChevronDown className="text-sm" />
        </motion.button>
        <AnimatePresence>
          {isMeetingsDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
            >
              <Link
                to="/new-meeting"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                New Meeting
              </Link>
              <Link
                to="/join-meeting"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Join Meeting
              </Link>
              <Link
                to="/schedule-meeting"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Schedule Meeting
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contacts */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/contacts"
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
        >
          <FaUserFriends className="text-lg" />
          <span>Contacts</span>
        </Link>
      </motion.div>

      {/* Settings Dropdown */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
        >
          <FaCog className="text-lg" />
          <span>Settings</span>
          <FaChevronDown className="text-sm" />
        </motion.button>
        <AnimatePresence>
          {isSettingsDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
            >
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile Settings
              </Link>
              <Link
                to="/notifications"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Notifications
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default HeaderMenu; 