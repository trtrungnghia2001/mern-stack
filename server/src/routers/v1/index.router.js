import {
  adminMiddleware,
  authMiddleware,
} from "#server/middlewares/auth.middleware";
import express from "express";
import authRouter from "./public/auth.routes.js";
const v1Router = express.Router();

// public
v1Router.use("/auth", authRouter);

// me
v1Router.use("/me", authMiddleware);

// admin
v1Router.use("/admin", adminMiddleware);

export default v1Router;
