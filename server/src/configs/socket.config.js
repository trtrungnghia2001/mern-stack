import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import { ORIGIN_URLS } from "#server/shared/constants/url.constant";
import { roomModel } from "#server/api/v1/chat/models/room.model";
import { messageModel } from "#server/api/v1/chat/models/message.model";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ORIGIN_URLS,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
  },
});

export { io, httpServer };

// khoi tao user online {key:userId, value:socketId}
export const onlineUserMap = new Map();

export async function connectIo() {
  httpServer.listen(8000, function () {
    console.log(`Socket is running on port:: `, 8000);
  });
  io.on("connection", async function (socket) {
    // connect and disconnect
    console.log(`Soket connection:: `, socket.id);

    // kiem tra da co dang nhap chua
    const authId = socket.handshake.auth.authId;
    if (!authId) {
      console.log("AuthId not found!");
      socket.disconnect();
      return;
    }

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

    socket.on("disconnect", function () {
      console.log(`Soket disconnect:: `, socket.id);
      onlineUserMap.delete(authId);

      // cap nhat lai user dang online
      io.emit("onlineUsers", Array.from(onlineUserMap.keys()));
    });
  });
}
