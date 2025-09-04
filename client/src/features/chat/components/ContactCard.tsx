import { memo } from "react";
import type { IChatRoom } from "../types/chat.type";
import { timeAgo } from "../utils/time";
import { NavLink, useParams } from "react-router-dom";
import clsx from "clsx";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constanr";

interface ContactCardProps {
  data: IChatRoom;
  type?: "group" | "direct";
}

const ContactCard = ({ data }: ContactCardProps) => {
  const { id } = useParams();
  return (
    <NavLink
      to={`/chat/message/` + data._id}
      className={clsx([
        `flex items-center gap-3 p-4 py-2`,
        data._id === id && `bg-gray-100`,
      ])}
    >
      <div className="relative">
        <div className="w-8 aspect-square rounded-full overflow-hidden">
          <img
            src={data.avatar || IMAGE_NOTFOUND.avatar_notfound}
            alt="avatar"
            loading="lazy"
            className="img"
          />
        </div>
        <div className="absolute bottom-0 right-0 outline outline-white w-2 aspect-square rounded-full bg-green-500"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium line-clamp-1">{data.name}</span>
          <span className="text-xs text-gray-500">
            {timeAgo(data.createdAt)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-4">
          <p className="text-gray-500 line-clamp-1 text-13 flex-1">
            {data.lastMessage?.message || "No messages yet"}
          </p>
          {data.lastMessage && (
            <div className="bg-blue-500 text-white w-2 aspect-square text-xs leading-none font-medium rounded-full overflow-hidden flex items-center justify-center"></div>
          )}
        </div>
      </div>
    </NavLink>
  );
};

export default memo(ContactCard);
