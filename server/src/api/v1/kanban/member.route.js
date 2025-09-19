import express from "express";
import { handleResponseList } from "#server/shared/utils/response.util";
import userModel from "../user/user.model.js";

const memberRoute = express.Router();

memberRoute.get("/get-all", async (req, res, next) => {
  try {
    const _q = req.query._q || "";

    const data = await userModel.find({
      $or: [{ name: new RegExp(_q, "i") }, { email: new RegExp(_q, "i") }],
    });

    return handleResponseList(res, {
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

export default memberRoute;
