import express from "express";
import { columnModel, taskModel } from "./kanban.model.js";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { deleteFromCloudinary } from "#server/shared/services/cloudinary.service";

const columnRoute = express.Router();

columnRoute.post(`/create`, async (req, res, next) => {
  try {
    const user = req.user;
    const body = req.body;

    const position = await columnModel.countDocuments({ board: body.board });
    body.user = user._id;
    body.position = position;

    const newData = await columnModel.create(body);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      data: newData,
    });
  } catch (error) {
    next(error);
  }
});
columnRoute.put(`/update-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updateData = await columnModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return handleResponse(res, {
      data: updateData,
    });
  } catch (error) {
    next(error);
  }
});
columnRoute.delete(`/delete-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Xoá column
    const deleteData = await columnModel.findByIdAndDelete(id, {
      new: true,
    });

    // 2. Lấy tất cả task trong column
    const tasks = await taskModel.find({ column: id });

    // 3. Xoá bgUrl hoặc files của từng task trên Cloudinary
    if (tasks.length) {
      await Promise.all(
        tasks.map(async (task) => {
          // nếu mỗi task có 1 bgUrl
          if (task.bgUrl) {
            await deleteFromCloudinary(task.bgUrl);
          }

          // nếu task có nhiều files
          if (Array.isArray(task.files)) {
            await Promise.all(
              task.files.map((file) => deleteFromCloudinary(file.url))
            );
          }
        })
      );
    }

    // 4. Xoá luôn tất cả task trong column
    await taskModel.deleteMany({ column: id });

    return handleResponse(res, {
      data: deleteData,
    });
  } catch (error) {
    next(error);
  }
});
columnRoute.get(`/get-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await columnModel.findById(id);

    return handleResponse(res, {
      data: data,
    });
  } catch (error) {
    next(error);
  }
});
columnRoute.get(`/get-all/board/:boardId`, async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const data = await columnModel
      .find({
        board: boardId,
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
columnRoute.post(`/update-position`, async (req, res, next) => {
  try {
    const { columns } = req.body;

    const updateData = await columnModel.bulkWrite(
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

export default columnRoute;
