import mongoose, { Schema } from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: Number, default: 0 },
    bgColor: { type: Number, default: 0 },
    favorite: {
      type: Boolean,
      default: false,
    },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

export const boardModel =
  mongoose.models.kanbanBoard || mongoose.model("kanbanBoard", boardSchema);

//
const columnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: Number, default: 0 },
    bgColor: { type: Number, default: 0 },
    board: { type: Schema.Types.ObjectId, ref: "kanbanBoard" },
  },
  { timestamps: true }
);

export const columnModel =
  mongoose.models.kanbanColumn || mongoose.model("kanbanColumn", columnSchema);
