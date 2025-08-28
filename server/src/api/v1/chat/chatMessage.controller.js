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
}

export async function chatMessageSendMessageController(req, res, next) {
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
