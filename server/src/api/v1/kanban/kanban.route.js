import express from "express";
import boardRoute from "./board.route.js";
import columnRoute from "./column.route.js";
import taskRoute from "./tasks.route.js";
import commentRouter from "./comment.route.js";
import dashboardRouter from "./dashboard.route.js";

const kanbanRoute = express.Router();

kanbanRoute.use("/board", boardRoute);
kanbanRoute.use("/column", columnRoute);
kanbanRoute.use("/task", taskRoute);
kanbanRoute.use("/comment", commentRouter);
kanbanRoute.use("/dashboard", dashboardRouter);

export default kanbanRoute;
