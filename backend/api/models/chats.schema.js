import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    //  optional:for groups only
    chatName: {
      type: String,
      trim: true,
    },
    //  private or public chat
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  },
  { timestamps: true },
);

export const Chats = mongoose.model("Chats", chatSchema);
