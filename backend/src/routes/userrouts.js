import express from "express";
import {
  registerUser,
  loginuser,
  logoutuser,
  refreshaccesstoken,
  changecurrectuserpassword,
  getcurrectuser,
  updateaccount,
  addtohistory
} from "../controllers/usercontroler.js";
import { verifyJWT } from "../middleware/authmiddleware.js";

const router = express.Router();

// User registration
router.route("/register").post(registerUser);

// User login
router.route("/login").post(loginuser);

// User logout (requires authentication)
router.route("/logout").post(verifyJWT, logoutuser);

// Refresh access token (does not require authentication)
router.route("/refresh-token").post(refreshaccesstoken);

// Change current user's password (requires authentication)
router.route("/change-password").post(verifyJWT, changecurrectuserpassword);

// Get current user details (requires authentication)
router.route("/current-user").get(verifyJWT, getcurrectuser);

// Update user account details (requires authentication)
router.route("/update-account").put(verifyJWT, updateaccount);

// Add to user activity history (requires authentication)
router.route("/add_to_activity").post(verifyJWT, addtohistory);

export default router;