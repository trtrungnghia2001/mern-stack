import { handleResponse } from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { roomModel } from "./models/room.model.js";

export const checkRoomAccess = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { roomId } = req.params;

    const room = await roomModel.findById(roomId).lean();
    if (!room)
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Room not found",
      });

    const isMember = room.members.some(
      (m) => m.user.toString() === userId.toString()
    );
    if (!isMember)
      return handleResponse(res, {
        status: StatusCodes.FORBIDDEN,
        message: "Access denied",
      });

    next();
  } catch (error) {
    next(error);
  }
};
