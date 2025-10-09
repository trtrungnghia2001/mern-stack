import express from "express";
import { roomModel } from "../models/room.model.js";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import userModel from "../../user/user.model.js";
import { messageModel } from "../models/message.model.js";

const roomRoute = express.Router();

roomRoute.get(`/`, async (req, res, next) => {
  try {
    const _q = req.query._q || "";
    const _type = req.query._type || "direct";
    const userId = req.user._id;
    const _page = parseInt(req.query._page);

    const regex = { $regex: _q, $options: "i" };
    let results = [];

    if (_type === "direct") {
      // 1. Lấy tất cả user phù hợp (trừ bản thân)
      const users = await userModel
        .find({ _id: { $ne: userId }, name: regex })
        .lean();

      // 2. Lấy tất cả phòng chat có mình
      const rooms = await roomModel
        .find({ type: "direct", "members.user": userId })
        .populate("members.user")
        .populate({
          path: "lastMessage",
          populate: { path: "sender" },
        })
        .lean();

      if (!_q) {
        results = rooms;
      } else {
        // 3.Tạo map userId room thật (để kiểm tra ai đã có room với mình)
        const userRoomMap = new Map();
        for (const room of rooms) {
          const other = room.members.find(
            (m) => m.user._id.toString() !== userId.toString()
          );

          userRoomMap.set(other.user._id.toString(), room);
        }

        // 4.Chưa có thì tạo room giả, co thì để nguyên
        for (const u of users) {
          const room = userRoomMap.get(u._id.toString());

          if (room) {
            results.push(room);
          } else {
            results.push({
              _id: "temp-" + u._id,
              name: u.name,
              avatar: u.avatar,
              type: "direct",
              members: [{ user: { _id: userId } }, { user: u }],
              isNew: true,
            });
          }
        }
      }

      results = results.map((r) => {
        const other = r.members.find(
          (m) => m.user._id.toString() !== userId.toString()
        );
        return {
          ...r,
          name: other?.user?.name,
          avatar: other?.user?.avatar,
          userId: other?.user?._id || null,
        };
      });
    }

    if (_type === "group") {
      results = await roomModel
        .find({ name: regex, type: "group" })
        .populate("members.user")
        .populate({
          path: "lastMessage",
          populate: { path: "sender" },
        })
        .lean();
    }

    return handleResponseList(res, {
      data: results,
    });
  } catch (error) {
    next(error);
  }
});
roomRoute.get(`/:roomId`, async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const _type = req.query._type || "group";

    const userId = req.user._id;

    let room = await roomModel.findById(roomId).populate("members.user").lean();

    if (_type === "direct") {
      const other = room.members.find((m) => m.user._id.toString() !== userId);

      room = { ...room, ...other.user };

      room.userId = other?.user?._id;
    }

    return handleResponse(res, {
      data: room,
    });
  } catch (error) {
    next(error);
  }
});
roomRoute.post(`/`, async (req, res, next) => {
  try {
    const body = req.body;
    const userId = req.user._id;

    body.createdBy = userId;
    const otherId = body.members?.[0]?.user;
    body.members.push({ user: userId, role: "admin" });

    if ((body.type = "direct")) {
      const room = await roomModel
        .findOne({
          type: "direct",
          "members.user": {
            $all: [userId, otherId],
          },
        })
        .populate("members.user")
        .populate({
          path: "lastMessage",
          populate: { path: "sender" },
        })
        .lean();

      if (room)
        return handleResponse(res, {
          status: StatusCodes.CREATED,
          data: room,
        });
    }

    const newRoom = await roomModel.create(body);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      data: newRoom,
    });
  } catch (error) {
    next(error);
  }
});
roomRoute.put(`/:roomId`, async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await roomModel
      .findByIdAndUpdate(roomId, req.body, { new: true })
      .populate("members.user");

    return handleResponse(res, {
      data: room,
    });
  } catch (error) {
    next(error);
  }
});
roomRoute.delete(`/:roomId`, async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await roomModel.findByIdAndDelete(roomId, {
      new: true,
    });

    return handleResponse(res, {
      data: room,
    });
  } catch (error) {
    next(error);
  }
});
// media
roomRoute.get(`/:roomId/media`, async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const medias = await messageModel
      .find({
        room: roomId,
        attachments: { $exists: true, $ne: [] },
      })
      .populate("sender")
      .lean();

    return handleResponse(res, {
      data: medias,
    });
  } catch (error) {
    next(error);
  }
});
// member
roomRoute.get(`/:roomId/available-members`, async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await roomModel.findById(roomId).lean();

    const members = room.members.map((m) => m.user.toString());

    const available = await userModel.find({
      _id: { $nin: members },
    });

    return handleResponse(res, {
      data: available,
    });
  } catch (error) {
    next(error);
  }
});
roomRoute.post(`/:roomId/members`, async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { userIds } = req.body;

    const room = await roomModel
      .findByIdAndUpdate(
        roomId,
        {
          $addToSet: {
            members: {
              $each: userIds.map((id) => ({ user: id })),
            },
          },
        },
        { new: true }
      )
      .populate("members.user");

    return handleResponse(res, {
      data: room,
    });
  } catch (error) {
    next(error);
  }
});
roomRoute.delete(`/:roomId/members/:userId`, async (req, res, next) => {
  try {
    const { roomId, userId } = req.params;

    const room = await roomModel
      .findByIdAndUpdate(
        roomId,
        {
          $pull: {
            members: { user: userId },
          },
        },
        { new: true }
      )
      .lean();

    console.log({ roomId, userId, room });

    return handleResponse(res, {
      data: room,
    });
  } catch (error) {
    next(error);
  }
});
roomRoute.patch(`/:roomId/members/:userId/role`, async (req, res, next) => {
  try {
    const { roomId, userId } = req.params;
    const { role } = req.body;

    const room = await roomModel.findOneAndUpdate(
      {
        _id: roomId,
        "members.user": userId,
      },
      {
        $set: {
          "members.$.role": role,
        },
      },
      { new: true }
    );

    return handleResponse(res, {
      data: room,
    });
  } catch (error) {
    next(error);
  }
});

export default roomRoute;
