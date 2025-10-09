import express from "express";
import { handleResponseList } from "#server/shared/utils/response.util";
import userModel from "../../user/user.model.js";

const memberRoute = express.Router();

memberRoute.get(`/`, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const _q = req.query._q || "";
    const members = await userModel.find({
      _id: { $ne: userId },
      name: {
        $regex: _q,
        $options: "i",
      },
    });

    return handleResponseList(res, {
      data: members,
    });
  } catch (error) {
    next(error);
  }
});

export default memberRoute;
