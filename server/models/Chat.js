import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      isRead: {
        type: Boolean,
        default: false,
      },
    },
  ],
  lastMessage: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
});

export default mongoose.model("Chat", chatSchema);
