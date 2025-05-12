import mongoose from "mongoose";

const { Schema } = mongoose;

const meetingschema = new Schema({
  meeting_id: { 
      type: String, 
      required: true 
  },
  title: {
      type: String,
      default: "Untitled Meeting"
  },
  host_user: {  // To track who created the meeting
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
  },
  participants: [{
      user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          default: null  // Changed from required: true since guests won't have IDs
      },
      username: {
          type: String,
          required: true // Username is always required
      },
      join_time: {
          type: Date,
          default: Date.now
      }
  }],
  chats: [{
      sender: {
          type: String,
          required: true
      },
      message: {
          type: String,
          required: true
      },
      createdAt: {
          type: Date,
          default: Date.now
      }
  }],
  start_time: {
      type: Date,
      default: Date.now
  },
  end_time: {
      type: Date
  }
}, { timestamps: true });
const meeting = mongoose.model("meeting", meetingschema);
export default meeting;
