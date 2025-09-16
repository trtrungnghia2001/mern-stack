import express from "express";
import { boardModel, boardViewModel } from "./kanban.model.js";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";

const boardRoute = express.Router();

boardRoute.post(`/create`, async (req, res, next) => {
  try {
    const user = req.user;
    const body = req.body;

    const position = await boardModel.countDocuments({ user: user._id });
    body.user = user._id;
    body.position = position;

    const newData = await boardModel.create(body);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      data: newData,
    });
  } catch (error) {
    next(error);
  }
});
boardRoute.put(`/update-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updateData = await boardModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    return handleResponse(res, {
      data: updateData,
    });
  } catch (error) {
    next(error);
  }
});
boardRoute.delete(`/delete-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteData = await boardModel.findByIdAndDelete(id, {
      new: true,
    });

    await boardViewModel.findOneAndDelete(
      {
        board: id,
        user: req.user._id,
      },
      { new: true }
    );

    return handleResponse(res, {
      data: deleteData,
    });
  } catch (error) {
    next(error);
  }
});
boardRoute.get(`/get-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await boardModel.findById(id).populate({
      path: "workspace",
      populate: [{ path: "owner" }, { path: "members.user" }],
    });

    return handleResponse(res, {
      data: data,
    });
  } catch (error) {
    next(error);
  }
});
boardRoute.get(`/get-all`, async (req, res, next) => {
  try {
    const user = req.user;
    const data = await boardModel
      .find({
        user: user._id,
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
boardRoute.post(`/update-position`, async (req, res, next) => {
  try {
    const { boards } = req.body;

    const updateData = await boardModel.bulkWrite(
      boards.map((b) => ({
        updateOne: {
          filter: { _id: b._id },
          update: { $set: { position: b.position } },
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
boardRoute.get(`/get-view`, async (req, res, next) => {
  try {
    const user = req.user;
    const data = await boardViewModel
      .find({
        user: user._id,
      })
      .sort({
        updatedAt: -1,
      })
      .populate(["board"]);

    return handleResponseList(res, {
      data: data.map((item) => item.board),
    });
  } catch (error) {
    next(error);
  }
});
boardRoute.post(`/add-view`, async (req, res, next) => {
  try {
    const user = req.user;
    const { board } = req.body;

    const filter = {
      user: user._id,
      board: board,
    };

    // Check nếu user đã từng xem board này
    let checkData = await boardViewModel.findOne(filter);

    let newData;

    if (checkData) {
      // Update updatedAt
      checkData.updatedAt = new Date();
      await checkData.save();
      newData = checkData;
    } else {
      // Tạo mới
      newData = await boardViewModel.create(filter);
    }

    newData = await boardViewModel.findOne(filter).populate(["board"]);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      data: newData.board,
    });
  } catch (error) {
    next(error);
  }
});
boardRoute.get(`/workspace/:workspaceId`, async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const getData = await boardModel.find({
      workspace: workspaceId,
    });

    return handleResponse(res, {
      data: getData,
    });
  } catch (error) {
    next(error);
  }
});
export default boardRoute;
