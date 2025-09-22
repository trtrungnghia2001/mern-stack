import session from "express-session";
import ENV_CONFIG from "./env.config.js";

const SESSION_CONFIG = session({
  secret: ENV_CONFIG.JWT_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: ENV_CONFIG.IS_PRODUCTION,
    secure: ENV_CONFIG.IS_PRODUCTION,
    sameSite: ENV_CONFIG.IS_PRODUCTION ? "none" : "lax",
  },
});

export default SESSION_CONFIG;
