import express from "express";
import { chatMessageModel } from "./chat.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "#server/shared/services/cloudinary.service";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import upload from "#server/configs/multer.config";
import {
  checkRommAdminMiddleware,
  checkRommOwneMiddleware,
} from "./chat.middleware.js";
import {
  chatRoomCreate,
  chatRoomIdAddMember,
  chatRoomIdDelete,
  chatRoomIdRemoveMember,
  chatRoomIdUpdate,
} from "./chatRoom.controller.js";

const chatRouter = express.Router();

// room
chatRouter.post("/room/create", chatRoomCreate);

chatRouter.put(
  "/room/:roomId/update",
  checkRommOwneMiddleware,
  upload.single("avatar"),
  chatRoomIdUpdate
);

chatRouter.delete("/room/:roomId", checkRommOwneMiddleware, chatRoomIdDelete);

chatRouter.put(
  "/room/:roomId/add-member",
  checkRommAdminMiddleware,
  chatRoomIdAddMember
);

chatRouter.put(
  "/room/:roomId/remove-member",
  checkRommAdminMiddleware,
  chatRoomIdRemoveMember
);

chatRouter.put(
  "/room/:roomId/transfer-owner",
  checkRommAdminMiddleware,
  async (req, res, next) => {
    try {
      const { roomId } = req.params;
    } catch (error) {
      next(error);
    }
  }
);

chatRouter.put("/room/:roomId/leave", async (req, res, next) => {
  try {
    const { roomId } = req.params;
  } catch (error) {
    next(error);
  }
});

chatRouter.put("/room/:roomId/set-role", async (req, res, next) => {
  try {
    const { roomId } = req.params;
  } catch (error) {
    next(error);
  }
});

// message
chatRouter.get("/room/:roomId", async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const messages = await chatMessageModel
      .find({ roomId })
      .populate(["sender"]);

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: "Get messages successfully!",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});
chatRouter.get("/conversations", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
chatRouter.post(
  "/send-message",
  upload.array("files"),
  async (req, res, next) => {
    try {
      const { roomId, message } = req.body;
      const files = req.files;
      const sender = req.user._id;

      let filesUpload = [];
      if (files && files.length > 0) {
      }
      const newMessage = await chatMessageModel.create({
        roomId,
        sender,
        message,
        files: filesUpload,
      });

      return handleResponse(res, {
        status: StatusCodes.CREATED,
        message: "Message sent successfully!",
        data: newMessage,
      });
    } catch (error) {
      next(error);
    }
  }
);
chatRouter.delete("/delete-message/:messageId", async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await chatMessageModel.findByIdAndDelete(messageId);

    if (deletedMessage.file.url) {
      await deleteFromCloudinary(deletedMessage.file.url);
    }

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Delete message successfully!",
      data: deletedMessage,
    });
  } catch (error) {
    next(error);
  }
});

export default chatRouter;
