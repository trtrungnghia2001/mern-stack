import express from "express";
import boardRoute from "./board.route.js";
import columnRoute from "./column.route.js";
import taskRoute from "./tasks.route.js";

const kanbanRoute = express.Router();

kanbanRoute.use("/board", boardRoute);
kanbanRoute.use("/column", columnRoute);
kanbanRoute.use("/task", taskRoute);

export default kanbanRoute;
