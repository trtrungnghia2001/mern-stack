import express from "express";
import chatModel from "./chat.model.js";
import { deleteFromCloudinary } from "#server/shared/services/cloudinary.service";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import upload from "#server/configs/multer.config";

const chatRouter = express.Router();

chatRouter.get("/room/:roomId", async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const messages = await chatModel.find({ roomId }).populate(["sender"]);

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
      const newMessage = await chatModel.create({
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
    const deletedMessage = await chatModel.findByIdAndDelete(messageId);

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
