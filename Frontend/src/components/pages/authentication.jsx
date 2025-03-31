import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authecontext.jsx"; // Use the custom hook for accessing AuthContext
import { motion } from "framer-motion";
import { Avatar, TextField, Snackbar, Tabs, Tab } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
   
  });
  const navigator=useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const { login, register } = useAuth(); // Use the login and register functions from the context

  const handleAuth = async () => {
    try {
      if (tabIndex === 0) {
        await login({ username: formData.username, password: formData.password });
        setMessage("Logged in successfully!");
        navigator('/');
      } else {
        await register(formData);
        setMessage("Registered successfully!");
        setOpen(true);
        setFormData({
          username: "",
          email: "",
          password: "",
          fullname: "",
         
        });
        setTabIndex(0);
        navigator('/');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
              />
            )}

            {/* Username Field */}
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              className="bg-white rounded-lg"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

            {/* Email Field (Only for Signup) */}
            {tabIndex === 1 && (
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                className="bg-white rounded-lg"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            )}

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              className="bg-white rounded-lg"
              name="password"
              value={formData.password}
              onChange={handleChange}
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