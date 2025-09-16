import { handleResponse } from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { workspaceModel } from "./kanban.model.js";

export const workspaceOwnerMiddleware = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await workspaceModel.findById(workspaceId);

    if (!workspace)
      return handleResponse(res, {
        status: StatusCodes.NOT_FOUND,
        message: "Workspace not found",
      });

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return handleResponse(res, {
        status: StatusCodes.FORBIDDEN,
        message: "Forbidden: only owner can perform this action",
      });
    }

    req.workspace = workspace;

    next();
  } catch (error) {
    next(error);
  }
};
