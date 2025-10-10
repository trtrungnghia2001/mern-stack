import upload from "#server/configs/multer.config";
import express from "express";
import { messageModel } from "../models/message.model.js";
import { uploadToCloudinary } from "#server/shared/services/cloudinary.service";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { roomModel } from "../models/room.model.js";
import { io } from "#server/configs/socket.config";

const messageRoute = express.Router({
  mergeParams: true,
});

messageRoute.get(`/`, async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const userId = req.user._id;

    const room = await roomModel.findById(roomId).lean();
    const isMember = room.members.some(
      (m) => m.user.toString() === userId.toString()
    );
    if (!isMember) {
      return handleResponse(res, {
        status: StatusCodes.FORBIDDEN,
        message: "You are not a member of this room",
      });
    }

    const messages = await messageModel
      .find({ room: roomId })
      .populate("sender")
      .sort({ createdAt: 1 })
      .lean();

    return handleResponseList(res, {
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});
messageRoute.get(`/:messageId`, async (req, res, next) => {
  try {
    const { roomId, messageId } = req.params;

    const message = await messageModel
      .findOne({ _id: messageId, room: roomId })
      .populate("sender")
      .lean();

    return handleResponseList(res, {
      data: message,
    });
  } catch (error) {
    next(error);
  }
});
messageRoute.post(`/`, upload.array("files"), async (req, res, next) => {
  try {
    const body = req.body;
    const files = req.files;
    const userId = req.user._id;
    const { roomId } = req.params;

    const room = await roomModel
      .findById(roomId)
      .populate("members.user")
      .populate({
        path: "lastMessage",
        populate: { path: "sender" },
      });

    // kiem tra thanh vien neu la group
    if (room) {
      const isMember = room.members.some(
        (m) => m.user._id.toString() === userId.toString()
      );
      if (!isMember) {
        return handleResponse(res, {
          status: StatusCodes.FORBIDDEN,
          message: "You are not a member of this room",
        });
      }
    }

    let uploadFile;
    if (files && files.length > 0) {
      uploadFile = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );
    }

    let message = await messageModel.create({
      ...body,
      room: room._id,
      sender: userId,
      attachments: uploadFile,
      readBy: [userId],
    });

    room.lastMessage = message._id;
    await room.save();

    message = await messageModel.findById(message._id).populate("sender");

    // Emit sau khi save DB
    io.to(room._id.toString()).emit("new_message", message);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});
messageRoute.put(`/:messageId`, async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const body = req.body;

    const message = await messageModel.findOneAndUpdate(messageId, body, {
      new: true,
    });

    return handleResponse(res, {
      data: message,
    });
  } catch (error) {
    next(error);
  }
});
messageRoute.delete(`/:messageId`, async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await messageModel.findByIdAndDelete(messageId, {
      new: true,
    });

    return handleResponse(res, {
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

export default messageRoute;
