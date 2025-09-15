import { workspaceModel } from "./kanban.model.js";

export const workspaceOwnerMiddleware = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await workspaceModel.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Forbidden: only owner can perform this action" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
