import express from "express";
import {
  boardModel,
  boardViewModel,
  columnModel,
  commentModel,
  taskModel,
  workspaceModel,
} from "../kanban.model.js";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { workspaceOwnerMiddleware } from "../kanban.middleware.js";
import userModel from "../../user/user.model.js";

const workspaceRoute = express.Router();

workspaceRoute.post(`/create`, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const body = req.body;
    body.owner = userId;

    const newData = await workspaceModel.create(body);

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      data: newData,
    });
  } catch (error) {
    next(error);
  }
});
workspaceRoute.put(
  `/update-id/:workspaceId`,
  workspaceOwnerMiddleware,
  async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const body = req.body;

      const updateData = await workspaceModel.findByIdAndUpdate(
        workspaceId,
        body,
        {
          new: true,
        }
      );

      return handleResponse(res, {
        data: updateData,
      });
    } catch (error) {
      next(error);
    }
  }
);
workspaceRoute.delete(
  `/delete-id/:workspaceId`,
  workspaceOwnerMiddleware,
  async (req, res, next) => {
    try {
      const { workspaceId } = req.params;

      const boards = await boardModel.find({ workspace: workspaceId });
      for (const board of boards) {
        await columnModel.deleteMany({ board: board._id });
        await boardViewModel.deleteMany({ board: board._id });

        const tasks = await taskModel.find({ board: board._id });
        for (const task of tasks) {
          await commentModel.deleteMany({ task: task._id });
        }

        await taskModel.deleteMany({ board: board._id });
      }
      await boardModel.deleteMany({ workspace: workspaceId });

      const deleteData = await workspaceModel.findByIdAndDelete(workspaceId);

      return handleResponse(res, {
        data: deleteData,
      });
    } catch (error) {
      next(error);
    }
  }
);
workspaceRoute.get(`/get-id/:workspaceId`, async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const getData = await workspaceModel
      .findById(workspaceId)
      .populate(["members.user", "owner"]);

    return handleResponse(res, {
      data: getData,
    });
  } catch (error) {
    next(error);
  }
});
workspaceRoute.get(`/get-all`, async (req, res, next) => {
  try {
    const userId = req.user._id;

    const getData = await workspaceModel
      .find({
        $or: [{ owner: userId }, { "members.user": userId }],
      })
      .populate(["owner"])
      .sort({
        createdAt: -1,
      });

    return handleResponseList(res, {
      data: getData,
    });
  } catch (error) {
    next(error);
  }
});
// member
workspaceRoute.post(
  `/:workspaceId/member/add`,
  workspaceOwnerMiddleware,
  async (req, res, next) => {
    try {
      const { email } = req.body;

      // Lấy workspace
      const { workspace } = req;

      // check member
      const member = await userModel.findOne({ email });
      if (!member) {
        return handleResponse(res, {
          status: StatusCodes.NOT_FOUND,
          message: "Email not found",
        });
      }

      // Check xem member đã tồn tại chưa
      const exists = workspace.members.some(
        (m) => m.user.toString() === member._id.toString()
      );
      if (exists) {
        return handleResponse(res, {
          status: StatusCodes.BAD_REQUEST,
          message: "Member already in workspace",
        });
      }

      // Thêm member
      workspace.members.push({ user: member._id });
      await workspace.save();

      return handleResponse(res, {
        message: "Member added successfully",
        data: { user: member, role: "member" },
      });
    } catch (error) {
      next(error);
    }
  }
);
workspaceRoute.delete(
  `/:workspaceId/member/remove/:memberId`,
  workspaceOwnerMiddleware,
  async (req, res, next) => {
    try {
      const { memberId } = req.params;

      // Lấy workspace
      const { workspace } = req;

      // Check xem member đã tồn tại chưa
      const exists = workspace.members.some(
        (m) => m.user.toString() === memberId
      );
      if (!exists) {
        return handleResponse(res, {
          status: StatusCodes.BAD_REQUEST,
          message: "Member not found in workspace",
          data: getData,
        });
      }

      // Xóa member
      workspace.members = workspace.members.filter(
        (m) => m.user.toString() !== memberId
      );
      await workspace.save();

      return handleResponse(res, {
        message: "Member removed successfully",
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
);
workspaceRoute.put(
  `/:workspaceId/member/update-role`,
  workspaceOwnerMiddleware,
  async (req, res, next) => {
    try {
      const { memberId, role } = req.body;

      // Lấy workspace
      const { workspace } = req;
      // Check xem member đã tồn tại chưa
      const member = workspace.members.find(
        (m) => m.user.toString() === memberId
      );
      if (!member) {
        return handleResponse(res, {
          status: StatusCodes.BAD_REQUEST,
          message: "Member not found in workspace",
          data: getData,
        });
      }

      // Cập nhật role
      member.role = role;
      await workspace.save();

      return handleResponse(res, {
        message: "Member role updated successfully",
        data: {
          role: role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default workspaceRoute;
