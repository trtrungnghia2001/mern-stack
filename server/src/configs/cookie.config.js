import ENV_CONFIG from "./env.config.js";

export const defaultCookieOptions = {
  httpOnly: true,
  //   secure: true,
  //   sameSite: "None",
  secure: ENV_CONFIG.IS_PRODUCTION,
  sameSite: ENV_CONFIG.IS_PRODUCTION ? "none" : "lax",
};
