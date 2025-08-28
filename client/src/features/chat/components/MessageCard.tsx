import { memo } from "react";
import type { IChatRoom } from "../types/chat.type";
import { timeAgo } from "../utils/time";

const MessageCard = ({ data }: { data: IChatRoom }) => {
  return (
    <div key={data._id} className="flex items-center gap-3 p-4 py-2">
      <div className="relative">
        <div className="w-8 aspect-square rounded-full overflow-hidden">
          <img
            src={data.members[0].user?.avatar}
            alt="avatar"
            loading="lazy"
            className="img"
          />
        </div>
        <div className="absolute bottom-0 right-0 outline outline-white w-2 aspect-square rounded-full bg-green-500"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium line-clamp-1">
            {data.members[0].user?.name}
          </span>
          <span className="text-xs text-gray-500">
            {timeAgo(data.createdAt)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-4">
          <p className="text-gray-500 line-clamp-1 text-13 flex-1">
            {data.lastMessage}
          </p>
          <div className="bg-green-500 text-white w-5 aspect-square text-xs leading-none font-medium rounded-full overflow-hidden flex items-center justify-center">
            8
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MessageCard);
