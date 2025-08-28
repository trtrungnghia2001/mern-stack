import { handleResponse } from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { chatRoomModel } from "./chat.model.js";

export const checkRommRoleMiddleware = (roles = []) => {
  return async (req, res, next) => {
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

      // kiem tra co phai la thanh vien trong phong ko
      const member = room.members.find(
        (m) => m.user.toString() === userId.toString()
      );
      if (!member)
        return handleResponse(res, {
          status: StatusCodes.FORBIDDEN,
          message: "You are not a member of this room",
        });

      // kiem tra quyen
      if (!roles.includes(member.role)) {
        return res.status(403).json({ message: "Permission denied" });
      }

      req.room = room; // gán để dùng sau
      next();
    } catch (error) {
      next(error);
    }
  };
};
