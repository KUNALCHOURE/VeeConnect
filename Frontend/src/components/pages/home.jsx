import React, { useContext, useState } from "react";
import withAuth from "../../utils/withauth.jsx";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar.jsx";
import { Button, TextField, IconButton } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/authecontext.jsx";

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const { addtouserhistory } = useContext(AuthContext);

  const handleJoinCall = async () => {
    console.log("helo");
   // await addtouserhistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900 text-white">
      {/* Navbar */}
     

      {/* Main Content */}
      <motion.div
        className="w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-lg p-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          Providing <span className="text-orange-500">Quality</span> Video Calls
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Connect with friends, family, and colleagues seamlessly.
        </p>

        {/* Meeting Code Input */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <TextField
            variant="outlined"
            fullWidth
            label="Enter Meeting Code"
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
            className="bg-white rounded-lg"
          />

          {/* Join Button */}
          <motion.button
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105"
            onClick={handleJoinCall}
            whileHover={{ scale: 1.05 }}
          >
            Join Call
          </motion.button>
        </div>

        {/* History Button */}
        <IconButton className="mt-4 text-white hover:text-gray-300" onClick={() => navigate("/history")}>
          <HistoryIcon fontSize="large" />
        </IconButton>
      </motion.div>

      {/* Right Section - Image */}
      <motion.div
        className="flex justify-center mt-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="/video-call-illustration.png"
          alt="Video Call"
          className="w-80 md:w-[500px] drop-shadow-lg"
        />
      </motion.div>
    </div>
  );
}

export default withAuth(HomeComponent);
