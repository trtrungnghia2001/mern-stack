import express from "express";
import boardRoute from "./board.route.js";

const kanbanRoute = express.Router();

kanbanRoute.use("/board", boardRoute);

export default kanbanRoute;
