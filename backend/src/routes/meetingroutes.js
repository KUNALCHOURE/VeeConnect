import { Router } from "express";
import { verifyJWT } from "../middleware/authmiddleware.js";
import { 
    addmeetinghistory, 
    getUserMeetingHistory, 
    getmeetinghistory,
    createMeeting,
    addParticipant,
    endMeeting,
    getMeetingStats
} from "../controllers/meetingcontrollers.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyJWT);

// Meeting history routes
router.route("/addhistory").post(addmeetinghistory);
router.route("/history/user").get(getUserMeetingHistory);
router.route("/:meetingId").get(getmeetinghistory);
router.route("/:meetingId/stats").get(getMeetingStats);

// Meeting management routes
router.route("/create").post(createMeeting);
router.route("/addparticipant").post(addParticipant);
router.route("/end").post(endMeeting);

export default router;