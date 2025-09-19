import { memo } from "react";
import type { IMember } from "../types/member.type";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";
import { useWorkspaceStore } from "../stores/workspace.store";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/auth.store";

interface MemberCardProps {
  member: IMember;
}

const MemberCard = ({ member }: MemberCardProps) => {
  const { id } = useParams();
  const { removeMember, updateRoleMember, ownerId } = useWorkspaceStore();

  const removeMemberResult = useMutation({
    mutationFn: async () => await removeMember(id as string, member.user._id),
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.error(error.message),
  });

  const updateRoleMemberResult = useMutation({
    mutationFn: async (role: string) =>
      await updateRoleMember(id as string, { memberId: member.user._id, role }),
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.error(error.message),
  });

  const { user } = useAuthStore();
  const disabled = removeMemberResult.isPending || user?._id !== ownerId;

  return (
    <div className="bg-white shadow rounded-lg p-3 hover:shadow-md transition space-y-3 border">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="w-8 aspect-square rounded-full overflow-hidden bg-blue-200 flex items-center justify-center font-bold text-blue-700">
          <img
            src={member.user.avatar || IMAGE_NOTFOUND.avatar_notfound}
            alt="avatar"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="font-medium text-gray-800 line-clamp-1">
            {member?.user?.name || "Unknown User"}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1">
            {member?.user?.email}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-stretch gap-2">
        <select
          disabled={disabled}
          value={member.role}
          onChange={(e) => {
            updateRoleMemberResult.mutate(e.target.value);
          }}
          className="border rounded px-2 py-1 text-xs"
        >
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
        <Button
          disabled={disabled}
          onClick={() => removeMemberResult.mutate()}
          variant={"ghost"}
          size={"sm"}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default memo(MemberCard);
