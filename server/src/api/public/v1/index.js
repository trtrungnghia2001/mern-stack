import express from "express";
import authRouter from "./auth/auth.route.js";
import uploadRouter from "./upload/upload.route.js";

const routerV1 = express.Router();

routerV1.use("/auth", authRouter);
routerV1.use("/upload", uploadRouter);

export default routerV1;
