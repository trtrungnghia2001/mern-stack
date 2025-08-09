import express from "express";
import { validateAuth } from "#server/middlewares/validation.middleware";
import { authMiddleware } from "#server/middlewares/auth.middleware";
import {
  schemaChangePassword,
  schemaForgotPassword,
  schemaResetPassword,
  schemaSignin,
  schemaSignup,
  schemaUpdateMe,
} from "#server/schemas/auth.schema";
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
} from "#server/controllers/auth.controller";
import upload from "#server/configs/multer.config";
import passport from "passport";
import ENV_CONFIG from "#server/configs/env.config";

const authRouter = express.Router();

authRouter.post(`/signup`, validateAuth(schemaSignup), signupController);

authRouter.post(`/signin`, validateAuth(schemaSignin), signinController);

authRouter.post(`/signout`, signoutController);

authRouter.get(`/get-me`, authMiddleware, getMeController);

authRouter.put(
  `/update-me`,
  authMiddleware,
  upload.single("file-avatar"),
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
