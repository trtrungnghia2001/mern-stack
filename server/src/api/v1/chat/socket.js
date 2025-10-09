import { messageModel } from "./models/message.model";

export const chatSocket = async (roomId, userId) => {
  socket.on("mark_messages_read", async ({ roomId, userId }) => {
    await messageModel.updateMany(
      { roomId, readBy: { $ne: userId } },
      { $push: { readBy: userId } }
    );

    // Gửi lại cho các client trong room biết tin nhắn đã được đọc
    io.to(roomId).emit("messages_read", { roomId, userId });
  });
};
