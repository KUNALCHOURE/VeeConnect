import { Router } from "express";
import { verifyJWT } from "../middleware/authmiddleware.js";
import { 
    createMeeting,
    addParticipant,
    endMeeting
} from "../controllers/meetingcontrollers.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyJWT);

// Meeting management routes
router.route("/create").post(createMeeting);
router.route("/addparticipant").post(addParticipant);
router.route("/end").post(endMeeting);

export default router;