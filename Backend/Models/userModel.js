import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  profile_pic: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    maxlength: 200,
  },
  liking: {
    type: [String],
    default: [],
  },
},
{timestamps:true}
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;