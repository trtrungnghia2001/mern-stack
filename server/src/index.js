import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";

//
import { connectMongoDB } from "./configs/database.config.js";
import { connectRedis } from "./configs/redis.config.js";
import { connectIo } from "./configs/socket.config.js";
import ENV_CONFIG from "./configs/env.config.js";
import passportConfig from "./configs/passport.config.js";
import { handleError } from "./shared/utils/response.util.js";
import routerV2 from "./api/v2/index.js";
import routerV1 from "./api/v1/index.js";
import { defaultCookieOptions } from "./configs/cookie.config.js";
import { ORIGIN_URLS } from "./shared/constants/url.constant.js";

await connectMongoDB();
await connectIo();
// await connectRedis();

export const app = express();

app.use(
  cors({
    origin: ORIGIN_URLS,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(
  session({
    secret: ENV_CONFIG.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: defaultCookieOptions,
  })
);
// passport
app.use(passport.initialize());
app.use(passport.session());

// router
app.use("/api/v1", routerV1);
app.use("/api/v2", routerV2);

app.use(handleError);

if (!ENV_CONFIG.IS_PRODUCTION) {
  app.listen(ENV_CONFIG.PORT, function () {
    console.log(`Server is running on port:: `, ENV_CONFIG.PORT);
  });
}

export default app;
