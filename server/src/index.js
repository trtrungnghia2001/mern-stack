import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import { connectMongoDB } from "./configs/database.config.js";
import { connectRedis } from "./configs/redis.config.js";
import { connectIo } from "./configs/socket.config.js";
import CORS_CONFIG from "./configs/cors.config.js";
import ENV_CONFIG from "./configs/env.config.js";
import passportConfig from "./configs/passport.config.js";
import SESSION_CONFIG from "./configs/session.configs.js";
import { handleError } from "./shared/utils/response.util.js";
import routerV1 from "./api/public/v1/index.js";

await connectMongoDB();
await connectIo();
// await connectRedis();

export const app = express();
app.use(CORS_CONFIG);
app.use(cookieParser());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(SESSION_CONFIG);
app.use(passport.initialize());
app.use(passport.session());

app.listen(ENV_CONFIG.PORT, function () {
  console.log(`Server is running on port:: `, ENV_CONFIG.PORT);
});

// router
app.use("/api/v1", routerV1);

app.use(handleError);
