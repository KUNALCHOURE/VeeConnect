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


router.use(verifyJWT);


router.route("/create").post(createMeeting);


router.route("/addhistory").post(addmeetinghistory);


router.route("/:meetingId").get(getmeetinghistory);


router.route("/history/user").get(getUserMeetingHistory);

router.route("/participant/add").post(addParticipant);

router.route("/end").post(endMeeting);

router.route("/:meetingId/stats").get(getMeetingStats);

export default router;