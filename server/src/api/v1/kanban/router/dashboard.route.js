import express from "express";
import {
  boardModel,
  columnModel,
  taskModel,
  workspaceModel,
} from "../kanban.model.js";
import { handleResponse } from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import ExcelJS from "exceljs";

const dashboardRouter = express.Router();

dashboardRouter.get("/overview", async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Lấy danh sách board mà user tham gia
    const workspaces = await workspaceModel
      .find({
        $or: [{ owner: userId }, { "members.user": userId }],
      })
      .select("_id");

    const workspaceIds = workspaces.map((w) => w._id);

    const boards = await boardModel
      .find({
        $or: [
          { user: userId }, // owner board
          { workspace: { $in: workspaceIds } }, // board trong workspace mình tham gia
        ],
      })
      .select("_id");

    const boardIds = boards.map((b) => b._id);

    // 2. Summary
    const totalBoards = boardIds.length;

    const totalTasks = await taskModel.countDocuments({
      board: { $in: boardIds },
    });

    const completedTasks = await taskModel.countDocuments({
      board: { $in: boardIds },
      complete: true,
    });

    const overdueTasks = await taskModel.countDocuments({
      board: { $in: boardIds },
      complete: false,
      endDate: { $lt: new Date() },
    });

    const inProgress = await taskModel.countDocuments({
      board: { $in: boardIds },
      complete: false,
      endDate: { $gte: new Date() },
    });

    const noDeadline = await taskModel.countDocuments({
      board: { $in: boardIds },
      complete: false,
      $or: [{ endDate: null }, { endDate: "" }],
    });

    const statusData = [
      { name: "In Progress", value: inProgress },
      { name: "Complete", value: completedTasks },
      { name: "Overdue", value: overdueTasks },
      { name: "No Deadline", value: noDeadline },
    ];

    // 3. Task theo từng board
    const boardAgg = await taskModel.aggregate([
      {
        $match: { board: { $in: boardIds } },
      },
      {
        $group: {
          _id: "$board",
          tasks: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "kanbanboards",
          localField: "_id",
          foreignField: "_id",
          as: "board",
        },
      },
      { $unwind: "$board" },
      {
        $project: {
          _id: 0,
          name: "$board.name",
          tasks: 1,
          updatedAt: "$board.updatedAt",
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    // 4. Board Overview (full breakdown)
    const boardOverview = await boardModel.aggregate([
      {
        $match: {
          _id: { $in: boardIds },
        },
      },
      {
        $lookup: {
          from: "kanbantasks",
          localField: "_id",
          foreignField: "board",
          as: "tasks",
        },
      },
      {
        $project: {
          name: 1,
          updatedAt: 1,
          tasksCount: { $size: "$tasks" },
          inProgress: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "t",
                cond: {
                  $and: [
                    { $eq: ["$$t.complete", false] },
                    { $gte: ["$$t.endDate", new Date()] },
                  ],
                },
              },
            },
          },
          completed: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "t",
                cond: { $eq: ["$$t.complete", true] },
              },
            },
          },
          overdue: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "t",
                cond: {
                  $and: [
                    { $eq: ["$$t.complete", false] },
                    { $lt: ["$$t.endDate", new Date()] },
                  ],
                },
              },
            },
          },
          noDeadline: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "t",
                cond: {
                  $and: [
                    { $eq: ["$$t.complete", false] },
                    {
                      $or: [
                        { $eq: ["$$t.endDate", null] },
                        { $eq: ["$$t.endDate", ""] },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    return handleResponse(res, {
      status: StatusCodes.OK,
      data: {
        summary: {
          boards: totalBoards,
          tasks: totalTasks,
          completed: completedTasks,
          overdue: overdueTasks,
        },
        statusData,
        boardData: boardAgg,
        boardOverview,
      },
    });
  } catch (err) {
    next(err);
  }
});

dashboardRouter.get("/export", async (req, res, next) => {
  try {
    // Lấy data từ DB
    const boards = await boardModel.find().lean();
    const columns = await columnModel.find().lean();
    const tasks = await taskModel.find().lean();

    const workbook = new ExcelJS.Workbook();

    // --- Boards ---
    const boardSheet = workbook.addWorksheet("Boards");
    if (boards.length > 0) {
      // headers = tất cả field trong object đầu tiên
      boardSheet.columns = Object.keys(boards[0]).map((key) => ({
        header: key,
        key: key,
        width: 20,
      }));
      boardSheet.addRows(boards);
    }

    // --- Columns ---
    const columnSheet = workbook.addWorksheet("Columns");
    if (columns.length > 0) {
      columnSheet.columns = Object.keys(columns[0]).map((key) => ({
        header: key,
        key: key,
        width: 20,
      }));
      columnSheet.addRows(columns);
    }

    // --- Tasks ---
    const taskSheet = workbook.addWorksheet("Tasks");
    if (tasks.length > 0) {
      taskSheet.columns = Object.keys(tasks[0]).map((key) => ({
        header: key,
        key: key,
        width: 20,
      }));
      taskSheet.addRows(tasks);
    }

    // Xuất file Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=kanban_export.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
});

export default dashboardRouter;
