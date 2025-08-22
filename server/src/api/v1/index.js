import express from "express";
import authRouter from "./auth/auth.route.js";
import uploadRouter from "./upload/upload.route.js";
import chatRouter from "./chat/chat.route.js";
import { authMiddleware } from "#server/shared/middlewares/auth.middleware";

const routerV1 = express.Router();

routerV1.use("/auth", authRouter);
routerV1.use("/upload", uploadRouter);
routerV1.use("/chat", authMiddleware, chatRouter);

export default routerV1;
