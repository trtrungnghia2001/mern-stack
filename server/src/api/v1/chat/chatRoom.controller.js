import { chatRoomModel } from "./chat.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "#server/shared/services/cloudinary.service";
import { handleResponse } from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { ROOM_ROLE } from "./chat.constant.js";

export async function chatRoomCreateController(req, res, next) {
  try {
    const body = req.body;
    const ownerId = req.user._id;
    body.members = [
      {
        user: ownerId,
        role: ROOM_ROLE.OWNER,
      },
    ];

    const newRoom = await chatRoomModel.create(body);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: "Create room successfully",
      data: newRoom,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdUpdateController(req, res, next) {
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
      message: "Update room successfully",
      data: updateRoom,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdDeleteController(req, res, next) {
  try {
    const { roomId } = req.params;
    const deletedRoom = await chatRoomModel.findByIdAndDelete(roomId);
    if (deletedRoom.avatar) {
      await deleteFromCloudinary(deletedRoom.avatar);
    }

    await chatMessageModel.deleteMany({ room: roomId });

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Delete room successfully",
      data: deletedRoom,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdAddMemberController(req, res, next) {
  try {
    const { memberId } = req.body;
    const room = req.room;

    // kiem tra member da ton tai trong phong chua
    const isMember = room.members.find((m) => m.user.toString() === memberId);
    if (isMember) {
      return handleResponse(res, {
        status: StatusCodes.BAD_REQUEST,
        message: "Member already in room",
        data: room,
      });
    }
    // them member
    room.members.push({ user: memberId });

    await room.save();

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Add member successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdRemoveMemberController(req, res, next) {
  try {
    const { memberId } = req.body;
    const room = req.room;

    // kiem tra member da ton tai trong phong chua
    const isMember = room.members.find((m) => m.user.toString() === memberId);
    if (!isMember) {
      return handleResponse(res, {
        status: StatusCodes.BAD_REQUEST,
        message: "Member not in room",
        data: room,
      });
    }

    // xoa member
    room.members = room.members.filter((m) => m.user.toString() !== memberId);

    await room.save();

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Remove member successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdLeaveController(req, res, next) {
  try {
    const user = req.user;
    const room = req.room;

    // check member in room
    const member = room.members.find(
      (m) => m.user.toString() === user._id.toString()
    );
    if (!member) {
      return handleResponse(res, {
        status: StatusCodes.BAD_REQUEST,
        message: "You are not in this room",
      });
    }

    // check roles, if you are the owner then don't leave the room empty
    if (member.role === ROOM_ROLE.OWNER) {
      return handleResponse(res, {
        status: StatusCodes.FORBIDDEN,
        message: "You must transfer ownership before leaving the room",
      });
    }

    room.members = room.members.filter(
      (m) => m.user.toString() !== user._id.toString()
    );
    await room.save();

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Left the room successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdTransferOwnerController(req, res, next) {
  try {
    const { newOwnerId } = req.body;
    const room = req.room;
    const user = req.user;

    const member = room.members.find((m) => m._id.toString() === newOwnerId);
    if (!member)
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "User is not in this room",
      });

    room.members = room.members.map((m) => {
      if (m._id.toString() === user._id)
        return { ...m.toObject(), role: ROOM_ROLE.ADMIN };
      if (m._id.toString() === newOwnerId)
        return { ...m.toObject(), role: ROOM_ROLE.OWNER };
      return m;
    });

    await room.save();
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Transferred ownership",
      data: room,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdSetRoleController(req, res, next) {
  try {
    const { memberId, role } = req.body;
    const room = req.room;
    const user = req.user;

    if (role === ROOM_ROLE.OWNER)
      return handleResponse(res, {
        status: StatusCodes.BAD_REQUEST,
        message: "Invalid role",
      });
    if (memberId.toString() === user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    // check user in room
    const member = room.members.find((m) => m.user.toString() === memberId);
    if (!member)
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "User is not in room",
      });

    // cannot change owner role
    if (member.role === ROOM_ROLE.OWNER)
      return handleResponse(res, {
        status: StatusCodes.FORBIDDEN,
        message: "Cannot change owner role",
      });

    member.role = role;
    await room.save();

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Role updated",
      data: room,
    });
  } catch (error) {
    next(error);
  }
}
export async function chatRoomIdConversationsController(req, res, next) {
  try {
    const user = req.user;
    const rooms = await chatRoomModel
      .find({
        "members.user": user._id,
      })
      .select(["members.user", "lastMessage"])
      .sort({ updatedAt: -1 });

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: "Conversations fetched",
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
}
