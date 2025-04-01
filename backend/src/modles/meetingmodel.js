import mongoose from "mongoose";

const { Schema } = mongoose;

const meetingschema = new Schema({
  user_id: { type: String },

  Date: { type: Date, default: Date.now, required: true },
  chats:[{
    sender:{type:String},
    message:{type:String},
    createdAt:{type:Date,default:Date.now}
  }],
  participants:[{
    user:{
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    username:{type:String},
    
  }],
 
},{timestamps:true});

const meeting = mongoose.model("meeting", meetingschema);
export default meeting;
