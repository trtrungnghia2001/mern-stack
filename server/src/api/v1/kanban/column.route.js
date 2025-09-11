import express from "express";
import { columnModel } from "./kanban.model.js";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";

const columnRoute = express.Router();

columnRoute.post(`/create`, async (req, res, next) => {
  try {
    const user = req.user;
    const body = req.body;

    const position = await columnModel.countDocuments({ user: user._id });
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
    const deleteData = await columnModel.findByIdAndDelete(id, {
      new: true,
    });

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
    console.log({ columns });

    const updateData = await columnModel.bulkWrite(
      columns.map((c, idx) => ({
        updateOne: {
          filter: { _id: c._id },
          update: { $set: { position: idx } },
        },
      }))
    );

    console.log({ columns, updateData });
    return handleResponseList(res, {
      data: updateData,
    });
  } catch (error) {
    next(error);
  }
});

export default columnRoute;
