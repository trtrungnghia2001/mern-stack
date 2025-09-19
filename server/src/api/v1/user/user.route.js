import express from "express";
import userModel from "./user.model.js";
import { handleResponseList } from "#server/shared/utils/response.util";

const userRoute = express.Router();

userRoute.get("/get-all", async (req, res, next) => {
  try {
    const data = await userModel.find();
    return handleResponseList(res, {
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

export default userRoute;
