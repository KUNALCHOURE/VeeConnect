import meeting from "../modles/meetingmodel.js";
import asynchandler from "../../utils/asynchandler.js";
import Apierror from "../../utils/Apierror.js";
import Apiresponse from "../../utils/Apiresponse.js";

const createMeeting = asynchandler(async (req, res) => {
  const { meeting_id, host_user, start_time, participants, title } = req.body;

  if (!meeting_id) {
      throw new Apierror(400, "Meeting ID is required");
  }

  const newMeeting = new meeting({
      meeting_id,
      title: title || `Meeting on ${new Date().toLocaleDateString()}`,
      host_user: host_user || req.user._id,
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
  const { meeting_id, end_time, participants } = req.body;

  if (!meeting_id) {
      throw new Apierror(400, "Meeting ID is required");
  }

  const updatedMeeting = await meeting.findOneAndUpdate(
      { meeting_id },
      {
          $set: {
              end_time: end_time || new Date(),
              participants: participants || [],
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

export {
  createMeeting,
  addParticipant,
  endMeeting
};
