import mongoose, { Schema } from "mongoose";

// board
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

// boardView
const boardViewSchema = new mongoose.Schema(
  {
    board: { type: Schema.Types.ObjectId, ref: "kanbanBoard", required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

export const boardViewModel =
  mongoose.models.kanbanBoardView ||
  mongoose.model("kanbanBoardView", boardViewSchema);

// column
const columnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: Number, default: 0 },
    bgColor: { type: Number, default: 0 },
    board: { type: Schema.Types.ObjectId, ref: "kanbanBoard" },
    save: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const columnModel =
  mongoose.models.kanbanColumn || mongoose.model("kanbanColumn", columnSchema);

// task
const todoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: Number, default: 0 },
    bgUrl: { type: String },
    column: { type: Schema.Types.ObjectId, ref: "kanbanColumn" },
    board: { type: Schema.Types.ObjectId, ref: "kanbanBoard" },
    complete: { type: Boolean, default: false },
    description: String,
    startDate: String,
    endDate: String,
    files: {
      type: Schema.Types.Mixed,
      default: [],
    },
    todos: {
      type: [todoSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const taskModel =
  mongoose.models.kanbanTask || mongoose.model("kanbanTask", taskSchema);
