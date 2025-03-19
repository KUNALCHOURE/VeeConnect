import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authecontext";
import { motion } from "framer-motion";
import { Avatar, TextField, Button, Snackbar, Tabs, Tab } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function AuthPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const { handleRegister, handlelogin } = useContext(AuthContext);

  const handleAuth = async () => {
    try {
      if (tabIndex === 0) {
        let result = await handlelogin(username, password);
        setMessage(result);
      } else {
        let result = await handleRegister(fullname, username, password);
        setMessage(result);
        setOpen(true);
        setUsername("");
        setPassword("");
        setFullname("");
        setTabIndex(0);
      }
    } catch (error) {
      let message = error.response?.data?.message || "An unexpected error occurred";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900 text-white">
      {/* Authentication Container */}
      <motion.div
        className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-lg p-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Avatar Icon */}
        <Avatar sx={{ bgcolor: "orange", margin: "auto" }}>
          <LockOutlinedIcon />
        </Avatar>
        <h1 className="text-2xl font-semibold mt-3">
          {tabIndex === 0 ? "Sign In" : "Sign Up"}
        </h1>

        {/* Tabs for Switching */}
        <Tabs 
          value={tabIndex} 
          onChange={(e, newValue) => setTabIndex(newValue)} 
          centered
          textColor="inherit"
          indicatorColor="secondary"
          className="mt-4"
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>

        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4 mt-4">
            {/* Full Name Input (Only for Signup) */}
            {tabIndex === 1 && (
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                className="bg-white rounded-lg"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            )}

            {/* Username Field */}
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              className="bg-white rounded-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              className="bg-white rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          {/* Action Button */}
          <motion.button
            className="mt-6 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg rounded-lg shadow-lg transition-all transform hover:scale-105"
            onClick={handleAuth}
            whileHover={{ scale: 1.05 }}
          >
            {tabIndex === 0 ? "Sign In" : "Register"}
          </motion.button>

          {/* Link to Home */}
          <p className="mt-4 text-gray-300">
            <Link to="/" className="text-orange-400 hover:underline">Back to Home</Link>
          </p>
        </motion.div>
      </motion.div>

      {/* Snackbar Notification */}
      <Snackbar open={open} autoHideDuration={4000} message={message} onClose={() => setOpen(false)} />
    </div>
  );
}
