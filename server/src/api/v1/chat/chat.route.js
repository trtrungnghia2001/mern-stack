import express from "express";
import upload from "#server/configs/multer.config";
import { checkRommRoleMiddleware } from "./chat.middleware.js";
import { ROOM_ROLE } from "./chat.constant.js";
import {
  chatRoomConversationsController,
  chatRoomCreateController,
  chatRoomIdAddMemberController,
  chatRoomIdDeleteController,
  chatRoomIdLeaveController,
  chatRoomIdRemoveMemberController,
  chatRoomIdSetRoleController,
  chatRoomIdTransferOwnerController,
  chatRoomIdUpdateController,
} from "./chatRoom.controller.js";
import {
  chatMessageDeleteMessageIdController,
  chatMessageRoomIdController,
  chatMessageSendMessageController,
} from "./chatMessage.controller.js";

const chatRouter = express.Router();

// room
chatRouter.post(
  "/room/create",
  upload.single("avatarFile"),
  chatRoomCreateController
);

chatRouter.put(
  "/room/:roomId/update",
  checkRommRoleMiddleware([ROOM_ROLE.OWNER]),
  upload.single("avatarFile"),
  chatRoomIdUpdateController
);

chatRouter.delete(
  "/room/:roomId",
  checkRommRoleMiddleware([ROOM_ROLE.OWNER]),
  chatRoomIdDeleteController
);

chatRouter.put(
  "/room/:roomId/add-member",
  checkRommRoleMiddleware([ROOM_ROLE.OWNER, ROOM_ROLE.ADMIN]),
  chatRoomIdAddMemberController
);

chatRouter.put(
  "/room/:roomId/remove-member",
  checkRommRoleMiddleware([ROOM_ROLE.OWNER]),
  chatRoomIdRemoveMemberController
);

chatRouter.put("/room/:roomId/leave", chatRoomIdLeaveController);

chatRouter.put(
  "/room/:roomId/transfer-owner",
  checkRommRoleMiddleware([ROOM_ROLE.OWNER]),
  chatRoomIdTransferOwnerController
);

chatRouter.put(
  "/room/:roomId/set-role",
  checkRommRoleMiddleware([ROOM_ROLE.OWNER]),
  chatRoomIdSetRoleController
);

chatRouter.get("/room/conversations", chatRoomConversationsController);

// message
chatRouter.get("/message/room/:roomId", chatMessageRoomIdController);

chatRouter.post(
  "/message/send-message",
  upload.array("files"),
  chatMessageSendMessageController
);

chatRouter.delete(
  "/message/delete-message/:messageId",
  chatMessageDeleteMessageIdController
);

export default chatRouter;
