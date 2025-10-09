import mongoose, { Schema, model, Types } from "mongoose";

const roomSchema = new Schema(
  {
    name: { type: String },
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
      default: "direct",
    },
    description: { type: String },
    members: [
      {
        user: { type: Types.ObjectId, ref: "user", required: true },
        role: {
          type: String,
          enum: ["member", "admin"],
          default: "member",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    lastMessage: { type: Types.ObjectId, ref: "chatMessage" },
    createdBy: { type: Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

export const roomModel =
  mongoose.models.chatRoom || mongoose.model("chatRoom", roomSchema);
