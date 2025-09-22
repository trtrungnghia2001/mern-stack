import express from "express";
import { commentModel } from "../kanban.model.js";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";

const commentRouter = express.Router();

commentRouter.post(`/create`, async (req, res, next) => {
  try {
    const user = req.user;
    const body = req.body;
    body.user = user._id;

    const newData = await commentModel.create(body);
    const getData = await commentModel.findById(newData._id).populate(["user"]);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      data: getData,
    });
  } catch (error) {
    next(error);
  }
});
commentRouter.put(`/update-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updateData = await commentModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return handleResponse(res, {
      data: updateData,
    });
  } catch (error) {
    next(error);
  }
});
commentRouter.delete(`/delete-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteData = await commentModel.findByIdAndDelete(id, {
      new: true,
    });

    return handleResponse(res, {
      data: deleteData,
    });
  } catch (error) {
    next(error);
  }
});
commentRouter.get(`/get-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await commentModel.findById(id);

    return handleResponse(res, {
      data: data,
    });
  } catch (error) {
    next(error);
  }
});
commentRouter.get(`/get-all/task/:taskId`, async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const data = await commentModel
      .find({
        task: taskId,
      })
      .populate(["user"])
      .sort({
        createdAt: -1,
      });

    return handleResponseList(res, {
      data: data,
    });
  } catch (error) {
    next(error);
  }
});
commentRouter.post(`/update-position`, async (req, res, next) => {
  try {
    const { columns } = req.body;

    const updateData = await commentModel.bulkWrite(
      columns.map((c, idx) => ({
        updateOne: {
          filter: { _id: c._id },
          update: { $set: { position: idx } },
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

export default commentRouter;
