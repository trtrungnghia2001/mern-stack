import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import { ORIGIN_URLS } from "#server/constants/url.constant";

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

// khoi tao
export const onlineUserMap = new Map();

export async function connectIo() {
  httpServer.listen(8000, function () {
    console.log(`Socket is running on port:: `, 8000);
  });
  io.on("connection", function (socket) {
    // connect and disconnect
    console.log(`Soket connection:: `, socket.id);

    // kiem tra da co dang nhap chua
    const authId = socket.handshake.auth.authId;
    if (!authId) {
      console.log("AuthId not found!");
      socket.disconnect();
      return;
    }
    onlineUserMap.set(authId, socket.id);

    socket.on("disconnect", function () {
      console.log(`Soket disconnect:: `, socket.id);
      onlineUserMap.delete(authId);

      // cap nhat lai user dang online
      io.emit("onlineUsers", Array.from(onlineUserMap.keys()));
    });

    // gui user dang online
    io.emit("onlineUsers", Array.from(onlineUserMap.keys()));
  });
}
