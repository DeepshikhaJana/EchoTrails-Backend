import mongoose from "mongoose";

const storyShareSchema = new mongoose.Schema({
  story_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  img_url: [String],
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      created_at: { type: Date, default: Date.now },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const StoryShare = mongoose.model("StoryShare", storyShareSchema);
export default StoryShare;