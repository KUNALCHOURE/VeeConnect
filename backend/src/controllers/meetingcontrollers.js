import meeting from "../modles/meetingmodel.js";
import asynchandler from "../../utils/asynchandler.js";
import Apierror from "../../utils/Apierror.js";
import Apiresponse from "../../utils/Apiresponse.js";
import User from "../modles/usermodel.js";
import { mongoose } from "mongoose";

const addmeetinghistory = asynchandler(async (req, res) => {
console.log(
"meeting history"
)
  const { meeting_id, chats, participants } = req.body;
//console.log(meeting_id, chats, participants);
  // Validate required fields
  if (!meeting_id || !participants || !Array.isArray(participants)) {
    throw new Apierror(400, "Meeting ID and participants are required");
  }

  try {
    // Create new meeting with current date
    const newmeeting = new meeting({
      meeting_id,
      chats: chats || [],
      participants,
      Date: new Date()
    });
//console.log("saving the newmeeting",newmeeting);
    // Save the meeting
    const savedMeeting = await newmeeting.save();

    // Update history for all participants
    const updatePromises = participants.map(async (participant) => {
      const user = await User.findById(participant.user);
      if (user) {
        user.history.push({
          meetingID: savedMeeting._id
        });
        await user.save({validateBeforeSave:false}); //we did this because Mongoose was trying to validate all
        //  required fields in the user schema, including email and fullname, even though we're only updating the history field.
      }
    });
   // console.log("updating the history",updatePromises);
    await Promise.all(updatePromises);

    res.status(201).json(
      new Apiresponse(201, savedMeeting, "Meeting history added successfully")
    );
  } catch (error) {
    throw new Apierror(400, "Problem occurred while storing the meeting history",error.message);
  }
});

const getmeetinghistory = asynchandler(async (req, res) => {
  const { meetingId } = req.params;
  console.log("meetingId",meetingId);
  if(!mongoose.isValidObjectId(meetingId)){
    throw new Apierror(400, "Invalid meeting ID");
  }
    const meetingData = await meeting.findById(meetingId).populate('participants.user', 'username');
    if (!meetingData) {
      throw new Apierror(404, "Meeting not found");
    }
  
  res.status(200).json(
    new Apiresponse(200, meetingData, "Meeting details fetched successfully")
  );
});

const getUserMeetingHistory = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'history.meetingID',
    select: 'meeting_id Date', // Select only necessary fields
  });

  if (!user) {
    throw new Apierror(404, "User not found");
  }

  res.status(200).json(
    new Apiresponse(200, user.history, "User meeting history fetched successfully")
  );
});

export { addmeetinghistory, getUserMeetingHistory, getmeetinghistory };