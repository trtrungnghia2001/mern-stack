import express from "express";
import passport from "passport";
import { validateAuth } from "./auth.validate.js";
import {
  schemaChangePassword,
  schemaForgotPassword,
  schemaResetPassword,
  schemaSignin,
  schemaSignup,
  schemaUpdateMe,
} from "./auth.schema.js";
import {
  changePasswordController,
  forgotPasswordController,
  getMeController,
  passportSigninFailedController,
  passportSigninSuccessController,
  refreshTokenController,
  resetPasswordController,
  signinController,
  signoutController,
  signupController,
  updateMeController,
} from "./auth.controller.js";
import { authMiddleware } from "#server/shared/middlewares/auth.middleware";
import upload from "#server/configs/multer.config";
import ENV_CONFIG from "#server/configs/env.config";

const authRouter = express.Router();

authRouter.post(`/signup`, validateAuth(schemaSignup), signupController);

authRouter.post(`/signin`, validateAuth(schemaSignin), signinController);

authRouter.post(`/signout`, signoutController);

authRouter.get(`/get-me`, authMiddleware, getMeController);

authRouter.put(
  `/update-me`,
  authMiddleware,
  upload.single("avatarFile"),
  validateAuth(schemaUpdateMe),
  updateMeController
);

authRouter.post(
  `/change-password`,
  authMiddleware,
  validateAuth(schemaChangePassword),
  changePasswordController
);

authRouter.post(`/refresh-token`, refreshTokenController);

authRouter.post(
  `/forgot-password`,
  validateAuth(schemaForgotPassword),
  forgotPasswordController
);

authRouter.post(
  `/reset-password`,
  validateAuth(schemaResetPassword),
  resetPasswordController
);

// ================= passport =================
authRouter.get("/passport/signin-success", passportSigninSuccessController);
authRouter.get("/passport/signin-failed", passportSigninFailedController);

// google
authRouter.get("/passport/google", passport.authenticate("google"));
authRouter.get(
  "/passport/google/callback",
  passport.authenticate("google", {
    successRedirect: ENV_CONFIG.PASSPORT_REDIRECT_SUCCESS,
    failureRedirect: ENV_CONFIG.PASSPORT_REDIRECT_FAILED,
  })
);

export default authRouter;
