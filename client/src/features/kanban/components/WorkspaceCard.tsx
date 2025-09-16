import { memo } from "react";
import type { IWorkspace } from "../types/workspace.type";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

interface WorkspaceCardProps {
  data: IWorkspace;
}

const WorkspaceCard = ({ data }: WorkspaceCardProps) => {
  return (
    <Link
      to={`/kanban/workspaces/` + data._id}
      className="block bg-white border shadow rounded-lg p-4 hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base font-semibold">{data.name}</h3>
        {/* <MoreVertical className="w-5 h-5 text-gray-400" /> */}
      </div>

      {/* Description */}
      <p className="text-gray-600 line-clamp-2 mb-4 h-[35px]">
        {data.description || "No description"}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-gray-500 text-xs">
        <div className="flex items-center gap-1 ">
          <Users size={16} />
          <span>{data.members?.length || 0} members</span>
        </div>
        <span>Owner: {data.owner?.name || "You"}</span>
      </div>
    </Link>
  );
};

export default memo(WorkspaceCard);
