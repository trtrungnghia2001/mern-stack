import express from "express";
import { taskModel } from "../kanban.model.js";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "#server/shared/services/cloudinary.service";
import upload from "#server/configs/multer.config";
import mongoose from "mongoose";

const taskRoute = express.Router();

taskRoute.post(`/create`, async (req, res, next) => {
  try {
    const user = req.user;
    const body = req.body;

    const position = await taskModel.countDocuments({ column: body.column });

    body.user = user._id;
    body.position = position;

    const newData = await taskModel.create(body);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      data: newData,
    });
  } catch (error) {
    next(error);
  }
});
taskRoute.put(
  `/update-id/:id`,
  upload.single("singleFile"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;

      let bgUrl = body.bgUrl;
      const file = req.file;
      if (file) {
        body.bgUrl = await (await uploadToCloudinary(file)).url;
        await deleteFromCloudinary(bgUrl);
      }

      const updateData = await taskModel
        .findByIdAndUpdate(id, body, {
          new: true,
        })
        .populate("todos.assignee", "name email avatar");

      return handleResponse(res, {
        data: updateData,
      });
    } catch (error) {
      next(error);
    }
  }
);
taskRoute.delete(`/delete-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteData = await taskModel.findByIdAndDelete(id, {
      new: true,
    });

    if (deleteData.bgUrl) {
      await deleteFromCloudinary(deleteData.bgUrl);
    }
    if (deleteData.files.length) {
      await Promise.all(
        deleteData.files.map((file) => deleteFromCloudinary(file.url))
      );
    }

    return handleResponse(res, {
      data: deleteData,
    });
  } catch (error) {
    next(error);
  }
});
taskRoute.get(`/get-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await taskModel
      .findById(id)
      .populate("todos.assignee", "name email avatar");

    return handleResponse(res, {
      data: data,
    });
  } catch (error) {
    next(error);
  }
});
taskRoute.get(`/get-all/board/:boardId`, async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const _filter = req.query.filter;

    let match = { board: new mongoose.Types.ObjectId(boardId) };

    if (_filter === "-1") {
      match.complete = false;
    } else if (_filter === "1") {
      match.complete = true;
    } else if (_filter === "2") {
      match.endDate = { $lt: new Date() };
    } else if (_filter === "3") {
      match.endDate = { $gte: new Date() };
    }

    const data = await taskModel.aggregate([
      { $match: match },
      {
        $project: {
          name: 1,
          complete: 1,
          column: 1,
          position: 1,
          bgUrl: 1,
          todoCount: { $size: "$todos" },
          fileCount: { $size: "$files" },
          todoCompleted: {
            $size: {
              $filter: {
                input: "$todos",
                as: "todo",
                cond: { $eq: ["$$todo.complete", true] },
              },
            },
          },
        },
      },
      { $sort: { position: 1 } },
    ]);

    return handleResponseList(res, { data });
  } catch (error) {
    next(error);
  }
});
taskRoute.post(`/update-position`, async (req, res, next) => {
  try {
    const { tasks } = req.body;

    const updateData = await taskModel.bulkWrite(
      tasks.map((t, idx) => ({
        updateOne: {
          filter: { _id: t._id },
          update: { $set: { position: idx, column: t.column } },
        },
      }))
    );

    return handleResponseList(res, {
      data: updateData,
    });
  } catch (error) {
    next(error);
  }
});
taskRoute.put(`/:taskId/todos/:todoId/assignee`, async (req, res, next) => {
  try {
    const { taskId, todoId } = req.params;
    const { assigneeId } = req.body;

    const task = await taskModel
      .findOneAndUpdate(
        { _id: taskId, "todos._id": todoId },
        { $set: { "todos.$.assignee": assigneeId } },
        { new: true }
      )
      .populate("todos.assignee");

    if (!task) {
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Task or Todo not found",
      });
    }

    return handleResponse(res, {
      data: task,
    });
  } catch (error) {
    next(error);
  }
});
taskRoute.delete(
  "/:taskId/todos/assignees/:assigneeId",
  async (req, res, next) => {
    try {
      const { taskId, assigneeId } = req.params;

      const task = await taskModel
        .findOneAndUpdate(
          { _id: taskId, "todos.assignee": assigneeId },
          { $set: { "todos.$.assignee": null } },
          { new: true }
        )
        .populate("todos.assignee");

      if (!task) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found" });
      }

      return res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  }
);
export default taskRoute;
