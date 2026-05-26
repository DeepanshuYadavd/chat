import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    chats: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
export const Messages = mongoose.model("Messages", messageSchema);
