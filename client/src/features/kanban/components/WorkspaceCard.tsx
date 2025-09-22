import { memo } from "react";
import type { IWorkspace } from "../types/workspace.type";
import { Ellipsis, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useWorkspaceStore } from "../stores/workspace.store";
import { useMutation } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/auth.store";

interface WorkspaceCardProps {
  data: IWorkspace;
}

const WorkspaceCard = ({ data }: WorkspaceCardProps) => {
  const { deleteById, setOpenForm, setEdit } = useWorkspaceStore();
  const { isPending, mutate } = useMutation({
    mutationFn: async () => await deleteById(data._id),
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.error(error.message),
  });

  const { user } = useAuthStore();

  return (
    <>
      <div className="block bg-white border shadow rounded-lg p-4 hover:shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <Link to={`/kanban/workspace/` + data._id}>
            <h3 className="text-base font-semibold hover:underline">
              {data.name}
            </h3>
          </Link>
          {data.owner._id === user?._id && (
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:bg-gray-200 p-1 rounded-full overflow-hidden">
                <Ellipsis size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.stopPropagation();
                    requestAnimationFrame(() => {
                      setOpenForm(true);
                      setEdit({
                        idEdit: data._id,
                        dataInitEdit: {
                          name: data.name,
                          description: data.description,
                        },
                      });
                    });
                  }}
                >
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isPending} onClick={() => mutate()}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
      </div>
    </>
  );
};

export default memo(WorkspaceCard);
