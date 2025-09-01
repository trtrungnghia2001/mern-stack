import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { chatMessageModel } from "./chat.model.js";

export async function chatMessageRoomIdController(req, res, next) {
  try {
    const { roomId } = req.params;

    const messages = await chatMessageModel
      .find({ room: roomId })
      .populate(["sender"]);

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: "Get messages successfully!",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
}

export async function chatMessageSendMessageController(req, res, next) {
  try {
    const { roomId, message } = req.body;
    const files = req.files;
    const sender = req.user._id;

    let filesUpload = [];
    if (files && files.length > 0) {
    }

    let newMessage = await chatMessageModel.create({
      room: roomId,
      sender,
      message,
      files: filesUpload,
    });

    newMessage = await chatMessageModel
      .findById(newMessage._id)
      .populate(["sender"]);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: "Message send successfully!",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
}

export async function chatMessageDeleteMessageIdController(req, res, next) {
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
}
