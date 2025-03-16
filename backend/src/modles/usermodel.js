import mongoose from "mongoose";

const { Schema } = mongoose;

const userschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshtoken: {
    type: String,
  },
});

const User = mongoose.model("user", userschema);
export default User;
