import mongoose, { Schema } from "mongoose";
import { ROOM_ROLE, ROOM_TYPE } from "./chat.constant.js";

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
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        role: {
          type: String,
          enum: Object.values(ROOM_ROLE),
          default: ROOM_ROLE.MEMBER,
        },
      },
    ],
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user", // Những user đã đọc message này
      },
    ],
    type: {
      type: String,
      enum: Object.values(ROOM_TYPE),
      default: ROOM_TYPE.DIRECT,
    },
    lastMessage: { type: Schema.Types.ObjectId, ref: "chatMessage" },

    // if group
    name: { type: String, required: true },
    avatar: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

export const chatRoomModel =
  mongoose.models.chatRoom || mongoose.model("chatRoom", chatRoomSchema);
