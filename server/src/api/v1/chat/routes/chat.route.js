import express from "express";
import messageRoute from "./message.route.js";
import roomRoute from "./room.route.js";
import memberRoute from "./members.route.js";

const chatRoute = express.Router();

chatRoute.use("/rooms", roomRoute);
chatRoute.use("/rooms/:roomId/messages", messageRoute);
chatRoute.use("/members", memberRoute);

export default chatRoute;
