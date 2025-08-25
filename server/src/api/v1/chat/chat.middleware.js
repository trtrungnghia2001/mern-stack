import { handleResponse } from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { chatRoomModel } from "./chat.model.js";

export const checkRommOwneMiddleware = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    // tim phong chat
    const room = await chatRoomModel.findById(roomId);
    if (!room)
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Room not found!",
        data: room,
      });

    // kiem tra quyen owner
    const isOwner = room.members.find(
      (m) => m.userId.toString() === userId.toString() && m.role === ROLE.OWNER
    );
    if (!isOwner)
      return handleResponse(res, {
        status: StatusCodes.FORBIDDEN,
        message: "You do not have permission to add members!",
      });

    req.room = room;

    next();
  } catch (error) {
    nert(error);
  }
};

export const checkRommAdminMiddleware = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    // tim phong chat
    const room = await chatRoomModel.findById(roomId);
    if (!room)
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Room not found!",
        data: room,
      });

    // kiem tra quyen admin
    const isAdmin = room.members.find(
      (m) => m.userId.toString() === userId.toString() && m.role === ROLE.ADMIN
    );
    if (!isAdmin)
      return handleResponse(res, {
        status: StatusCodes.FORBIDDEN,
        message: "You do not have permission to add members!",
      });

    req.room = room;

    next();
  } catch (error) {
    nert(error);
  }
};
