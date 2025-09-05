import express from "express";
import swaggerUi from "swagger-ui-express";

import { authMiddleware } from "#server/shared/middlewares/auth.middleware";
import authRouter from "./auth/auth.route.js";
import uploadRouter from "./upload/upload.route.js";
import chatRouter from "./chat/chat.route.js";
import adminRouter from "./admin/admin.route.js";
import swaggerDocument from "./swagger.js";

const routerV1 = express.Router();

routerV1.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

routerV1.use("/admin", adminRouter);
routerV1.use("/auth", authRouter);
routerV1.use("/upload", uploadRouter);
routerV1.use("/chat", authMiddleware, chatRouter);

export default routerV1;
