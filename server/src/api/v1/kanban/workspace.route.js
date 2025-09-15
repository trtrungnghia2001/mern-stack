import express from "express";
import { workspaceModel } from "./kanban.model";
import {
  handleResponse,
  handleResponseList,
} from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { workspaceOwnerMiddleware } from "./kanban.middleware.js";

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
workspaceRoute.patch(
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

      const deleteData = await workspaceModel.findByIdAndDelete(workspaceId, {
        new: true,
      });

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

    const getData = await workspaceModel.findById(workspaceId);

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

    const getData = await workspaceModel.find([
      {
        $or: [{ owner: userId }, { "members.user": userId }],
      },
    ]);

    return handleResponseList(res, {
      data: getData,
    });
  } catch (error) {
    next(error);
  }
});
workspaceRoute.post(
  `/:workspaceId/member/add`,
  workspaceOwnerMiddleware,
  async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const { memberId } = req.body;

      // Lấy workspace
      const workspace = await workspaceModel.findById(workspaceId);
      if (!workspace)
        return handleResponse(res, {
          status: StatusCodes.NOT_FOUND,
          message: "Workspace not found",
          data: getData,
        });

      // Check xem member đã tồn tại chưa
      const exists = workspace.members.some(
        (m) => m.user.toString() === memberId
      );
      if (exists) {
        return handleResponse(res, {
          status: StatusCodes.BAD_REQUEST,
          message: "Member already in workspace",
          data: getData,
        });
      }

      // Thêm member
      workspace.members.push({ user: memberId });
      await workspace.save();

      return handleResponse(res, {
        message: "Member added successfully",
        data: workspace,
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
      const { workspaceId, memberId } = req.params;

      // Lấy workspace
      const workspace = await workspaceModel.findById(workspaceId);
      if (!workspace)
        return handleResponse(res, {
          status: StatusCodes.NOT_FOUND,
          message: "Workspace not found",
          data: getData,
        });

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
workspaceRoute.patch(
  `/:workspaceId/member/update-role`,
  workspaceOwnerMiddleware,
  async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const { memberId, role } = req.body;

      // Lấy workspace
      const workspace = await workspaceModel.findById(workspaceId);
      if (!workspace)
        return handleResponse(res, {
          status: StatusCodes.NOT_FOUND,
          message: "Workspace not found",
          data: getData,
        });

      // Check xem member đã tồn tại chưa
      const member = workspace.members.some(
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
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default workspaceRoute;
