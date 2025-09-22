import express from "express";
import {
  boardModel,
  boardViewModel,
  favoriteBoardModel,
} from "../kanban.model.js";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { getBoardListAddFavorite } from "../kanban.service.js";

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

    await favoriteBoardModel.findOneAndDelete(
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
    const userId = req.user._id;

    const data = await boardModel
      .findById(id)
      .populate([
        {
          path: "workspace",
          populate: [
            {
              path: "owner",
            },
            {
              path: "members.user",
            },
          ],
        },
      ])
      .lean();

    data.favorite = (await favoriteBoardModel.findOne({
      board: id,
      user: userId,
    }))
      ? true
      : false;

    return handleResponse(res, {
      data: data,
    });
  } catch (error) {
    next(error);
  }
});
boardRoute.get(`/get-all`, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const boards = await getBoardListAddFavorite(boardModel, userId, {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    });
    return handleResponseList(res, {
      data: boards,
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
//
boardRoute.get(`/get-view`, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const views = await getBoardListAddFavorite(boardModel, userId, [
      {
        $lookup: {
          from: "kanbanboardviews",
          let: { boardId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$board", "$$boardId"] },
                    { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "viewInfo",
        },
      },
      {
        $match: { viewInfo: { $ne: [] } },
      },
      {
        $project: { viewInfo: 0 },
      },
      {
        $sort: {
          "viewInfo.updatedAt": -1,
        },
      },
    ]);

    return handleResponseList(res, {
      data: views,
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
//
boardRoute.get(`/get-me`, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const me = await getBoardListAddFavorite(boardModel, userId, {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    });

    return handleResponseList(res, {
      data: me,
    });
  } catch (error) {
    next(error);
  }
});
//
boardRoute.get(`/get-favorite`, async (req, res, next) => {
  try {
    const user = req.user;
    const data = await favoriteBoardModel
      .find({
        user: user._id,
      })
      .populate(["board"])
      .lean();

    return handleResponseList(res, {
      data: data.map((item) => ({ ...item.board, favorite: true })),
    });
  } catch (error) {
    next(error);
  }
});
boardRoute.post(`/add-favorite`, async (req, res, next) => {
  try {
    const user = req.user;
    const { board } = req.body;

    const filter = {
      user: user._id,
      board: board,
    };

    // Check nếu user đã từng favorite board này
    let checkData = await favoriteBoardModel.findOne(filter);

    let newData;

    if (checkData) {
      // Update updatedAt
      checkData.updatedAt = new Date();
      await checkData.save();
      newData = checkData;
    } else {
      // Tạo mới
      newData = await favoriteBoardModel.create(filter);
    }

    newData = await favoriteBoardModel
      .findOne(filter)
      .populate(["board"])
      .lean();

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      data: { ...newData.board, favorite: true },
    });
  } catch (error) {
    next(error);
  }
});
boardRoute.post(`/remove-favorite`, async (req, res, next) => {
  try {
    const user = req.user;
    const { board } = req.body;

    const filter = {
      user: user._id,
      board: board,
    };

    let checkData = await favoriteBoardModel.findOneAndDelete(filter);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      data: checkData.board,
    });
  } catch (error) {
    next(error);
  }
});

//
boardRoute.get(`/workspace/:workspaceId`, async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user._id;

    const boards = await getBoardListAddFavorite(boardModel, userId, {
      $match: {
        workspace: new mongoose.Types.ObjectId(workspaceId),
      },
    });

    return handleResponse(res, {
      data: boards,
    });
  } catch (error) {
    next(error);
  }
});
export default boardRoute;
