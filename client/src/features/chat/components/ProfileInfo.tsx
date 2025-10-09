import { memo, useState } from "react";
import type { IRoom } from "../types/room.type";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";
import { useRoomStore } from "../stores/room.store";
import { LogOut, Trash, UserPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/shared/components/ui/button";
import Loading from "./Loading";
import { toast } from "sonner";
import MemberModelForm from "./MemberModelForm";

const ProfileInfo = ({ contactInfo }: { contactInfo: IRoom }) => {
  const { user } = useAuthStore();
  const { removeMember, members } = useRoomStore();

  const isAdmin =
    members.find((m) => m.user._id === user?._id)?.role === "admin";

  const { isPending, mutate } = useMutation({
    mutationFn: async (memberId: string) =>
      await removeMember(contactInfo._id, memberId),
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.error(error.message),
  });

  const [openModelMember, setOpenModelMember] = useState(false);

  return (
    <>
      {isPending && <Loading />}
      <div className="space-y-4">
        <div className="text-gray-500 text-center">
          {contactInfo.description || contactInfo.bio}
        </div>
        {contactInfo.type === "direct" && (
          <ul className="text-gray-500 space-y-2">
            <li>
              <span className="font-medium">Phone: </span>{" "}
              {contactInfo.phoneNumber}
            </li>
            <li>
              <span className="font-medium">City: </span> {contactInfo.address}
            </li>
            <li>
              <span className="font-medium">Birthday: </span>{" "}
              {new Date(contactInfo.birthday).toDateString()}
            </li>
            <li>
              <span className="font-medium">Work: </span> {contactInfo.work}
            </li>
            <li>
              <span className="font-medium">Education: </span>{" "}
              {contactInfo.education}
            </li>
            <li>
              <span className="font-medium">Website: </span>{" "}
              {contactInfo.link_website}
            </li>
          </ul>
        )}
        {contactInfo.type === "group" && (
          <>
            <ul className="space-y-2">
              <li className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-medium">Member: </span> {members.length}
                </div>
                <div className="space-x-2">
                  {isAdmin && (
                    <>
                      <Button
                        onClick={() => setOpenModelMember(!openModelMember)}
                        size={"sm"}
                        variant={"outline"}
                      >
                        <UserPlus />
                      </Button>
                      <Button size={"sm"} variant={"outline"}>
                        <Trash />
                      </Button>
                    </>
                  )}
                  {!isAdmin && (
                    <Button size={"sm"} variant={"outline"}>
                      <LogOut />
                    </Button>
                  )}
                </div>
              </li>
            </ul>
            <ul className="space-y-2">
              {members.map((m) => (
                <li key={m.user._id} className="flex items-center gap-2">
                  <div className="w-8 overflow-hidden rounded-full aspect-square">
                    <img
                      src={m.user.avatar || IMAGE_NOTFOUND.avatar_notfound}
                      alt="avatar"
                      className="img"
                    />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <p className="text-sm font-medium">{m.user.name}</p>
                    <p className="text-xs text-gray-500">
                      <span className="capitalize"> {m.role} </span>
                      <span>-</span>{" "}
                      <span className="font-medium">Join at: </span>{" "}
                      {new Date(m.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {isAdmin && m.role !== "admin" && (
                    <button
                      onClick={() => mutate(m.user._id)}
                      className="opacity-50 hover:opacity-100 transition-all"
                    >
                      <LogOut size={16} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <MemberModelForm
        open={openModelMember}
        onOpenChange={setOpenModelMember}
        roomId={contactInfo._id}
      />
    </>
  );
};

export default memo(ProfileInfo);
