import mongoose, { Schema } from "mongoose";
import { WORKSPACE_ROLE } from "./kanban.constant.js";

// workspace
const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        role: {
          type: String,
          enum: Object.values(WORKSPACE_ROLE),
          default: WORKSPACE_ROLE.MEMBER,
        },
      },
    ],
  },
  { timestamps: true }
);

export const workspaceModel =
  mongoose.models.kanbanWorkspace ||
  mongoose.model("kanbanWorkspace", workspaceSchema);

// board
const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: Number, default: 0 },
    bgColor: { type: Number, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    workspace: { type: Schema.Types.ObjectId, ref: "kanbanWorkspace" },
  },
  { timestamps: true }
);

// favorite
const favoriteBoardSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    board: { type: Schema.Types.ObjectId, ref: "kanbanBoard", required: true },
  },
  { timestamps: true }
);

export const favoriteBoardModel =
  mongoose.models.kanbanFavoriteBoard ||
  mongoose.model("kanbanFavoriteBoard", favoriteBoardSchema);

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
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "user",
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
    startDate: Date,
    endDate: Date,
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

// comment
const commentSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    task: { type: Schema.Types.ObjectId, ref: "kanbanTask" },
    comment: String,
  },
  { timestamps: true }
);

export const commentModel =
  mongoose.models.kanbanComment ||
  mongoose.model("kanbanComment", commentSchema);
