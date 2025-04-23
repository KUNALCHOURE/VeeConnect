import meeting from "../modles/meetingmodel.js";
import asynchandler from "../../utils/asynchandler.js";
import Apierror from "../../utils/Apierror.js";
import Apiresponse from "../../utils/Apiresponse.js";
import User from "../modles/usermodel.js";
import { mongoose } from "mongoose";

const addmeetinghistory = asynchandler(async (req, res) => {
  const { meeting_id, chats, participants } = req.body;
console.log(participants);
  // Enhanced validation
  if (!meeting_id || !participants || !Array.isArray(participants)) {
    throw new Apierror(400, "Meeting ID and participants are required");
  }

  try {
    // Create new meeting with enhanced structure
    const newmeeting = new meeting({
      meeting_id,
      chats: chats?.map(chat => ({
        sender: chat.sender,
        message: chat.message,
        createdAt: chat.createdAt || new Date()
      })) || [],
      participants: participants.map(participant => ({
        user: participant.user || null, // Handle both registered and guest users
        username: participant.username || "Guest",
        join_time: new Date()
      })),
      start_time: new Date(),
      end_time: new Date() // Since this is called when meeting ends
    });

    const savedMeeting = await newmeeting.save();

    // Update history for registered participants only
    const updatePromises = participants
      .filter(participant => participant.user) // Only process participants with user IDs
      .map(async (participant) => {
        try {
          await User.findByIdAndUpdate(
            participant.user,
            {
              $push: {
                history: {
                  meetingID: savedMeeting._id,
                  joinedAs: participant.username,
                  joinTime: new Date()
                }
              }
            },
            { new: true }
          );
        } catch (error) {
          console.error(`Failed to update history for user ${participant.user}:`, error);
        }
      });

    await Promise.all(updatePromises);

    res.status(201).json(
      new Apiresponse(201, savedMeeting, "Meeting history added successfully")
    );
  } catch (error) {
    throw new Apierror(400, "Failed to store meeting history", error.message);
  }
});

const getmeetinghistory = asynchandler(async (req, res) => {
  const { meetingId } = req.params;

  if (!mongoose.isValidObjectId(meetingId)) {
    throw new Apierror(400, "Invalid meeting ID");
  }

  const meetingData = await meeting.findById(meetingId)
    .populate('participants.user', 'username email') // Add any other user fields you want to include
    .lean(); // Use lean() for better performance

  if (!meetingData) {
    throw new Apierror(404, "Meeting not found");
  }

  // Format the response data
  const formattedMeeting = {
    ...meetingData,
    participants: meetingData.participants.map(participant => ({
      ...participant,
      isRegistered: !!participant.user, // Add flag to indicate if user was registered
      username: participant.user?.username || participant.username // Prefer registered username if available
    })),
    duration: meetingData.end_time 
      ? (new Date(meetingData.end_time) - new Date(meetingData.start_time)) / 1000 / 60 // Duration in minutes
      : null
  };

  res.status(200).json(
    new Apiresponse(200, formattedMeeting, "Meeting details fetched successfully")
  );
});

const getUserMeetingHistory = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'history.meetingID',
      select: 'meeting_id start_time end_time participants chats',
      populate: {
        path: 'participants.user',
        select: 'username email'
      }
    })
    .lean();

  if (!user) {
    throw new Apierror(404, "User not found");
  }

  // Format the meeting history
  const formattedHistory = user.history.map(historyItem => {
    const meetingData = historyItem.meetingID;
    return {
      ...historyItem,
      meetingDetails: {
        meeting_id: meetingData.meeting_id,
        start_time: meetingData.start_time,
        end_time: meetingData.end_time,
        duration: meetingData.end_time 
          ? (new Date(meetingData.end_time) - new Date(meetingData.start_time)) / 1000 / 60
          : null,
        totalParticipants: meetingData.participants.length,
        participants: meetingData.participants.map(participant => ({
          username: participant.user?.username || participant.username,
          isRegistered: !!participant.user
        })),
        chatCount: meetingData.chats.length
      }
    };
  });

  // Sort by most recent first
  formattedHistory.sort((a, b) => 
    new Date(b.meetingDetails.start_time) - new Date(a.meetingDetails.start_time)
  );

  res.status(200).json(
    new Apiresponse(200, formattedHistory, "User meeting history fetched successfully")
  );
});

// New helper function to get meeting statistics
// Add these new controller functions to your existing meetingcontrollers.js

const createMeeting = asynchandler(async (req, res) => {
  const { meeting_id, host_user, start_time, participants } = req.body;

  if (!meeting_id) {
      throw new Apierror(400, "Meeting ID is required");
  }

  const newMeeting = new meeting({
      meeting_id,
      host_user: host_user || req.user._id, // Use authenticated user if no host specified
      start_time: start_time || new Date(),
      participants: participants || []
  });

  const savedMeeting = await newMeeting.save();

  return res.status(201).json(
      new Apiresponse(201, savedMeeting, "Meeting created successfully")
  );
});

const addParticipant = asynchandler(async (req, res) => {
  const { meeting_id, participant } = req.body;

  if (!meeting_id || !participant) {
      throw new Apierror(400, "Meeting ID and participant details are required");
  }

  const updatedMeeting = await meeting.findOneAndUpdate(
      { meeting_id },
      { 
          $push: { 
              participants: {
                  ...participant,
                  join_time: new Date()
              }
          }
      },
      { new: true }
  );

  if (!updatedMeeting) {
      throw new Apierror(404, "Meeting not found");
  }

  return res.json(
      new Apiresponse(200, updatedMeeting, "Participant added successfully")
  );
});

const endMeeting = asynchandler(async (req, res) => {
  const { meeting_id, end_time, participants, chats } = req.body;

  if (!meeting_id) {
      throw new Apierror(400, "Meeting ID is required");
  }

  const updatedMeeting = await meeting.findOneAndUpdate(
      { meeting_id },
      {
          $set: {
              end_time: end_time || new Date(),
              participants: participants || [],
              chats: chats || [],
              status: 'ended'
          }
      },
      { new: true }
  );

  if (!updatedMeeting) {
      throw new Apierror(404, "Meeting not found");
  }

  return res.json(
      new Apiresponse(200, updatedMeeting, "Meeting ended successfully")
  );
});

const getMeetingStats = asynchandler(async (req, res) => {

  const { meetingId } = req.params;
  console.log(meetingId);
  if (!mongoose.isValidObjectId(meetingId)) {
      throw new Apierror(400, "Invalid meeting ID");
  }

  const meetingData = await meeting.findById(meetingId);

  if (!meetingData) {
      throw new Apierror(404, "Meeting not found");
  }

  const stats = {
      totalParticipants: meetingData.participants.length,
      registeredUsers: meetingData.participants.filter(p => p.user).length,
      guestUsers: meetingData.participants.filter(p => !p.user).length,
      totalMessages: meetingData.chats.length,
      duration: meetingData.end_time 
          ? (new Date(meetingData.end_time) - new Date(meetingData.start_time)) / 1000 / 60
          : null,
      startTime: meetingData.start_time,
      endTime: meetingData.end_time
  };

  return res.json(
      new Apiresponse(200, stats, "Meeting statistics fetched successfully")
  );
});

// Export the new controllers
export {
  addmeetinghistory,
  getUserMeetingHistory,
  getmeetinghistory,
  createMeeting,
  addParticipant,
  endMeeting,
  getMeetingStats
};
