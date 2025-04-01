import { Router } from "express";
import { verifyJWT } from "../middleware/authmiddleware.js";
import { addmeetinghistory, getUserMeetingHistory, getmeetinghistory } from "../controllers/meetingcontrollers.js";

const router = Router();

// All routes are protected with JWT
router.use(verifyJWT);

// Meeting management routes
router.route("/addhistory").post(addmeetinghistory);
router.route("/gethistory").get(getmeetinghistory);

export default router; 