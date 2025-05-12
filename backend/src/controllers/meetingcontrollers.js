import meeting from "../modles/meetingmodel.js";
import asynchandler from "../../utils/asynchandler.js";
import Apierror from "../../utils/Apierror.js";
import Apiresponse from "../../utils/Apiresponse.js";
import User from "../modles/usermodel.js";
import { mongoose } from "mongoose";

const addmeetinghistory = asynchandler(async (req, res) => {
  const { meeting_id, chats, participants, title } = req.body;
  console.log("Received meeting data:", { meeting_id, title, participants, chats });

  // Enhanced validation
  if (!meeting_id || !participants || !Array.isArray(participants)) {
    throw new Apierror(400, "Meeting ID and participants are required");
  }

  try {
    // Process participants to ensure valid user IDs
    const processedParticipants = participants.map(participant => ({
      user: participant.user || null, // Handle both registered and guest users
      username: participant.username || "Guest",
      join_time: new Date()
    }));

    // Create new meeting with enhanced structure
    const newmeeting = new meeting({
      meeting_id,
      title: title || `Meeting on ${new Date().toLocaleDateString()}`, // Use provided title or generate one
      chats: chats?.map(chat => ({
        sender: chat.sender,
        message: chat.message,
        createdAt: chat.createdAt || new Date()
      })) || [],
      participants: processedParticipants,
      start_time: new Date(),
      end_time: new Date() // Since this is called when meeting ends
    });

    const savedMeeting = await newmeeting.save();
    console.log("Meeting saved successfully:", savedMeeting);

    // Update history for registered participants only
    const updatePromises = participants
      .filter(participant => participant.user && mongoose.isValidObjectId(participant.user)) // Only process valid user IDs
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
          console.log(`Updated history for user ${participant.user}`);
        } catch (error) {
          console.error(`Failed to update history for user ${participant.user}:`, error);
        }
      });

    await Promise.all(updatePromises);

    res.status(201).json(
      new Apiresponse(201, savedMeeting, "Meeting history added successfully")
    );
  } catch (error) {
    console.error("Error in addmeetinghistory:", error);
    throw new Apierror(400, "Failed to store meeting history", error.message);
  }
});

const getmeetinghistory = asynchandler(async (req, res) => {
  try {
    console.log("Retrieving meeting history for ID:", req.params.meetingId);

    const { meetingId } = req.params;

    if (!mongoose.isValidObjectId(meetingId)) {
      return res.status(400).json(
        new Apierror(400, "Invalid meeting ID format")
      );
    }

    const meetingData = await meeting.findById(meetingId)
      .populate('participants.user', 'username email')
      .lean();

    if (!meetingData) {
      console.log(`Meeting not found for ID: ${meetingId}`);
      return res.status(404).json(
        new Apierror(404, "Meeting not found", "The requested meeting does not exist")
      );
    }

    // Format the response data
    const formattedMeeting = {
      ...meetingData,
      participants: meetingData.participants.map(participant => ({
        ...participant,
        isRegistered: !!participant.user,
        username: participant.user?.username || participant.username
      })),
      duration: meetingData.end_time 
        ? (new Date(meetingData.end_time) - new Date(meetingData.start_time)) / 1000 / 60
        : null
    };
    
    console.log("Meeting details retrieved successfully");
    return res.status(200).json(
      new Apiresponse(200, formattedMeeting, "Meeting details fetched successfully")
    );
  } catch (error) {
    console.error("Error in getmeetinghistory:", error);
    throw new Apierror(error.statusCode || 500, error.message || "Failed to fetch meeting history");
  }
});

const getUserMeetingHistory = asynchandler(async (req, res) => {
  try {
    console.log("Getting user meeting history for user:", req.user._id);
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'history.meetingID',
        select: 'meeting_id title start_time end_time participants chats',
        populate: {
          path: 'participants.user',
          select: 'username email'
        }
      })
      .lean();

    if (!user) {
      return res.status(404).json(
        new Apierror(404, "User not found")
      );
    }

    // Format the meeting history - only include meetings that still exist
    const formattedHistory = user.history
      .filter(historyItem => historyItem.meetingID) // Filter out any deleted meetings
      .map(historyItem => {
        const meetingData = historyItem.meetingID;
        if (!meetingData) return null;

        // Calculate duration properly
        let duration = null;
        if (meetingData.end_time && meetingData.start_time) {
          const endTime = new Date(meetingData.end_time);
          const startTime = new Date(meetingData.start_time);
          duration = (endTime - startTime) / 1000 / 60; // Convert to minutes
        }

        return {
          _id: meetingData._id || historyItem._id, // Use meeting ID if available, otherwise use history item ID
          meetingDetails: {
            meeting_id: meetingData.meeting_id,
            title: meetingData.title || "Untitled Meeting",
            start_time: meetingData.start_time,
            end_time: meetingData.end_time,
            duration: duration,
            totalParticipants: meetingData.participants?.length || 0,
            participants: meetingData.participants?.map(participant => ({
              username: participant.user?.username || participant.username,
              isRegistered: !!participant.user
            })) || [],
            chatCount: meetingData.chats?.length || 0
          }
        };
      })
      .filter(item => item !== null); // Remove any null items

    // Sort by most recent first
    formattedHistory.sort((a, b) => 
      new Date(b.meetingDetails.start_time) - new Date(a.meetingDetails.start_time)
    );

    console.log(`Found ${formattedHistory.length} meeting records for user`);
    
    return res.status(200).json(
      new Apiresponse(200, formattedHistory, "User meeting history fetched successfully")
    );
  } catch (error) {
    console.error("Error in getUserMeetingHistory:", error);
    return res.status(error.statusCode || 500).json(
      new Apierror(error.statusCode || 500, error.message || "Failed to fetch meeting history")
    );
  }
});

// New helper function to get meeting statistics
// Add these new controller functions to your existing meetingcontrollers.js

const createMeeting = asynchandler(async (req, res) => {
  const { meeting_id, host_user, start_time, participants, title } = req.body;

  if (!meeting_id) {
      throw new Apierror(400, "Meeting ID is required");
  }

  const newMeeting = new meeting({
      meeting_id,
      title: title || `Meeting on ${new Date().toLocaleDateString()}`,
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
  try {
    console.log("Retrieving meeting stats for ID:", req.params.meetingId);
    const { meetingId } = req.params;
    
    if (!mongoose.isValidObjectId(meetingId)) {
      return res.status(400).json(
        new Apierror(400, "Invalid meeting ID format")
      );
    }

    const meetingData = await meeting.findById(meetingId);

    if (!meetingData) {
      console.log(`Meeting not found for ID: ${meetingId}`);
      return res.status(404).json(
        new Apierror(404, "Meeting not found", "The requested meeting does not exist")
      );
    }

    // Calculate duration properly
    let duration = null;
    if (meetingData.end_time && meetingData.start_time) {
      const endTime = new Date(meetingData.end_time);
      const startTime = new Date(meetingData.start_time);
      duration = (endTime - startTime) / 1000 / 60; // Convert to minutes
    }

    const stats = {
      totalParticipants: meetingData.participants.length,
      registeredUsers: meetingData.participants.filter(p => p.user).length,
      guestUsers: meetingData.participants.filter(p => !p.user).length,
      totalMessages: meetingData.chats.length,
      duration: duration,
      startTime: meetingData.start_time,
      endTime: meetingData.end_time,
      title: meetingData.title || "Untitled Meeting"
    };

    console.log("Meeting stats retrieved successfully");
    return res.status(200).json(
      new Apiresponse(200, stats, "Meeting statistics fetched successfully")
    );
  } catch (error) {
    console.error("Error in getMeetingStats:", error);
    throw new Apierror(error.statusCode || 500, error.message || "Failed to fetch meeting statistics");
  }
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
