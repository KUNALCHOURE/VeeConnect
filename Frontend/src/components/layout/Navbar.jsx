import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaVideo, FaCaretDown, FaSignOutAlt ,FaUser} from "react-icons/fa";
import { useAuth } from "../../context/authecontext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleJoinAsGuest = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate('/profile');
  };
  return (
    <div className="w-full bg-gray-900 shadow-lg py-4 fixed z-10">
      <nav className="container mx-auto flex justify-between items-center px-6">
        {/* Logo / Branding */}
        <div
          className="flex items-center space-x-2 text-white text-2xl font-bold tracking-wide hover:cursor-pointer"
          onClick={() => navigate("/")}
        >
          <FaVideo className="text-orange-500 text-3xl" />
          <span>Live Video Call</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 relative">
         
          {!user ? (
            <div className="flex flex-col sm:flex-row justify-evenly gap-4 sm:gap-10">

               <p
            className="text-gray-300 hover:text-white transition duration-300 cursor-pointer flex items-center"
            onClick={handleJoinAsGuest}
          >
            <FaUserPlus className="mr-2 text-orange-400" /> Join as Guest
          </p>
            
            <button
              className="flex items-center px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
              onClick={handleLogin}
            >
              <FaSignInAlt className="mr-2" /> Login
            </button>
            </div>
          ) : (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-"
                />
                <span className="text-white font-semibold">{user.username}</span>
                <FaCaretDown className="text-white" />
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
                  <button
                    className="w-full flex items-center px-4 py-2 text-white hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                  <button
                    className="w-full flex items-center px-4 py-2 text-white hover:bg-gray-700"
                    onClick={handleProfile}
                  >
                  <FaUser className="mr-2" /> Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
