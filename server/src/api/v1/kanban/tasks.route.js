import express from "express";
import { taskModel } from "./kanban.model.js";
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

const taskRoute = express.Router();

taskRoute.post(`/create`, async (req, res, next) => {
  try {
    const user = req.user;
    const body = req.body;

    const position = await taskModel.countDocuments({ column: body.column });
    console.log({ position });

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

      const updateData = await taskModel.findByIdAndUpdate(id, body, {
        new: true,
      });

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
    const data = await taskModel.findById(id);

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

    let filter = {};
    if (_filter === "-1") {
      filter = { complete: false };
    } else if (_filter === "1") {
      filter = { complete: true };
    } else if (_filter === "2") {
      filter = { endDate: { $lt: new Date() } };
    } else if (_filter === "3") {
      filter = { endDate: { $gte: new Date() } };
    }

    const data = await taskModel
      .find({
        board: boardId,
        ...filter,
      })
      .sort({
        position: 1,
      });

    return handleResponseList(res, {
      data: data,
    });
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

export default taskRoute;
