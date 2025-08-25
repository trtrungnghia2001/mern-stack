import mongoose, { Schema } from "mongoose";
import { ROLE } from "./chat.constant.js";

// message
const chatMessageSchema = new mongoose.Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: "chatRoom", require: true },
    sender: { type: Schema.Types.ObjectId, ref: "user", require: true },
    message: String,
    files: [
      {
        type: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const chatMessageModel =
  mongoose.models.chatMessage ||
  mongoose.model("chatMessage", chatMessageSchema);

// room
const chatRoomSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: String,
    description: String,
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        role: {
          type: String,
          enum: Object.values(ROLE.MEMBER),
          default: ROLE.MEMBER,
        },
      },
    ],
    isGroup: { type: Boolean, default: true }, // có thể phân biệt phòng nhóm hay 1-1 chat
  },
  {
    timestamps: true,
  }
);

export const chatRoomModel =
  mongoose.models.chatRoom || mongoose.model("chatRoom", chatRoomSchema);
