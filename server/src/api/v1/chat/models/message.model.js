import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: "chatRoom" },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },

    text: String,
    attachments: Schema.Types.Mixed,
    reactions: Schema.Types.Mixed,
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

export const messageModel =
  mongoose.models.chatMessage || mongoose.model("chatMessage", messageSchema);
