import { chatRoomModel } from "./chat.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "#server/shared/services/cloudinary.service";
import { handleResponse } from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { ROLE } from "./chat.constant.js";

export async function chatRoomCreate(req, res, next) {
  try {
    const body = req.body;
    const ownerId = req.user._id;
    body.members = [
      {
        user: ownerId,
        role: ROLE.OWNER,
      },
    ];

    const newRoom = await chatRoomModel.create(body);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: "Create room successfully!",
      data: newRoom,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdUpdate(req, res, next) {
  try {
    const { roomId } = req.params;
    const file = req.file;
    const body = req.body;

    let avatar = body.avatar;
    if (file) {
      avatar = (await uploadToCloudinary(file)).url;
      if (body.avatar) {
        await deleteFromCloudinary(body.avatar);
      }
    }

    const updateRoom = await chatRoomModel.findByIdAndUpdate(roomId, {
      ...body,
      avatar,
    });

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Update room successfully!",
      data: updateRoom,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdDelete(req, res, next) {
  try {
    const { roomId } = req.params;
    const deletedRoom = await chatRoomModel.findByIdAndDelete(roomId);
    if (deletedRoom.avatar) {
      await deleteFromCloudinary(deletedRoom.avatar);
    }

    await chatMessageModel.deleteMany({ room: roomId });

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Delete room successfully!",
      data: deletedRoom,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdAddMember(req, res, next) {
  try {
    const { memberId } = req.body;
    const room = req.room;

    // kiem tra member da ton tai trong phong chua
    const isMember = room.members.find((m) => m.user.toString() === memberId);
    if (isMember) {
      return handleResponse(res, {
        status: StatusCodes.BAD_REQUEST,
        message: "Member already in room!",
        data: room,
      });
    }
    // them member
    room.members.push({ user: memberId });

    await room.save();

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Add member successfully!",
      data: room,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdRemoveMember(req, res, next) {
  try {
    const { memberId } = req.body;
    const room = req.room;

    // kiem tra member da ton tai trong phong chua
    const isMember = room.members.find((m) => m.user.toString() === memberId);
    if (!isMember) {
      return handleResponse(res, {
        status: StatusCodes.BAD_REQUEST,
        message: "Member not in room!",
        data: room,
      });
    }

    // xoa member
    room.members = room.members.filter((m) => m.user.toString() !== memberId);

    await room.save();

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Remove member successfully!",
      data: room,
    });
  } catch (error) {
    next(error);
  }
}
