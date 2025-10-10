import { onlineUserMap } from "#server/configs/socket.config";
import { messageModel } from "./models/message.model.js";
import { roomModel } from "./models/room.model.js";

export const chatSocket = async (io, socket, authId) => {
  // nhan su kien tin nhan duoc doc
  socket.on("mark_messages_read", async ({ roomId }) => {
    await messageModel.updateMany(
      { room: roomId, readBy: { $ne: authId } },
      { $push: { readBy: authId } }
    );

    // Gửi lại cho các client trong room biết tin nhắn đã được đọc
    io.to(roomId).emit("messages_read", { roomId, authId });
  });

  // Join tất cả room mà user tham gia (group/direct)
  const userRooms = await roomModel
    .find({ "members.user": authId })
    .select("_id")
    .lean();
  userRooms.forEach((room) => {
    socket.join(room._id.toString());
  });

  // Emit lai danh sach online
  onlineUserMap.set(authId, socket.id);
  io.emit("onlineUsers", Array.from(onlineUserMap.keys()));

  // Rời phòng
  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    console.log(`${socket.id} left room ${roomId}`);
  });

  socket.on("join_room", async (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
  });
};
