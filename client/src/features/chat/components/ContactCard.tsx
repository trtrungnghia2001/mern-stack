import clsx from "clsx";
import { memo, useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context";
import type { IRoom } from "../types/room.type";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import instance from "@/configs/axios.config";
import type { ResponseSuccessType } from "@/shared/types/response";
import { useRoomStore } from "../stores/room.store";

interface ContactCardProps {
  data: IRoom;
}

const ContactCard: FC<ContactCardProps> = ({ data }) => {
  const { user } = useAuthStore();
  const { onlineUsers, setCurrentRoomId } = useChatContext();
  const { setPersons, persons } = useRoomStore();

  const isOnline = onlineUsers.find((i) => i === data?.userId);
  const isRead = data.lastMessage?.readBy?.find((u) => u === user?._id);

  const mess = data.lastMessage
    ? (data.lastMessage?.sender?._id === user?._id
        ? "Me: "
        : data.lastMessage.sender.name.split(" ").pop() + ": ") +
      (data.lastMessage?.text ?? "Send File")
    : "Hãy bắt đầu cuộc trò chuyện";

  // redirect
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const handleRoomClick = async () => {
    let roomId = data._id;

    if (data.isNew) {
      const res = await instance.post<ResponseSuccessType<IRoom>>(
        `api/v1/chat/rooms`,
        {
          type: "direct",
          members: [{ user: data.userId }],
        }
      );
      roomId = res.data.data._id;

      const newPersons = persons.map((p) =>
        p._id === data._id ? { ...p, _id: roomId, isNew: false } : p
      );

      setPersons(newPersons);
    }
    setCurrentRoomId(roomId);

    const redirectUrl = `/chat/messages/` + roomId + "?_type=" + data.type;
    navigate(redirectUrl);
  };

  useEffect(() => {
    setIsActive(location.pathname === `/chat/messages/${data._id}`);
  }, [location.pathname]);

  return (
    <div
      onClick={handleRoomClick}
      className={clsx([
        `w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 cursor-pointer`,
        isActive && `bg-gray-200`,
      ])}
    >
      <div className="relative">
        <div className="w-7 aspect-square rounded-full overflow-hidden">
          <img
            src={
              data.avatar ??
              (data.type === "group"
                ? IMAGE_NOTFOUND.group_notfound
                : IMAGE_NOTFOUND.avatar_notfound)
            }
            alt="avatar"
            loading="lazy"
            className="img"
          />
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 border-2 border-white bg-green-500 w-2.5 aspect-square rounded-full"></div>
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium text-13 line-clamp-1">{data.name}</div>
        <div
          className={clsx([
            `text-xs line-clamp-1`,
            isRead ? `text-gray-500` : `font-medium`,
          ])}
        >
          {mess}
        </div>
      </div>
    </div>
  );
};

export default memo(ContactCard);
