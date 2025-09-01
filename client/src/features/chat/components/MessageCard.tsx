import { memo } from "react";
import type { IChatMessage } from "../types/chat.type";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import clsx from "clsx";
import { timeAgo } from "../utils/time";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constanr";

const MessageCard = ({ data }: { data: IChatMessage }) => {
  const isYour = data.sender._id === useAuthStore.getState().user?._id;
  return (
    <div
      key={data._id}
      className={clsx([
        `flex items-start gap-2 max-w-[40%]`,
        isYour ? `flex-row-reverse ml-auto` : `flex-row`,
      ])}
    >
      <div className="w-6 aspect-square rounded-full overflow-hidden">
        <img
          src={data.sender.avatar || IMAGE_NOTFOUND.avatar_notfound}
          alt="avatar"
          loading="lazy"
          className="img"
        />
      </div>
      <div className="flex-1">
        {data.files.length > 0 && (
          <ul className="grid grid-cols-3 gap-2 mb-2">
            {data.files.map((item) => (
              <li key={item.url} className="rounded overflow-hidden">
                <img src={item.url} alt="img" loading="lazy" className="img" />
              </li>
            ))}
          </ul>
        )}
        {data.message && (
          <div
            className={clsx([
              `border rounded p-2 w-max`,
              isYour ? "ml-auto bg-gray-100" : "mr-auto",
            ])}
          >
            {data.message}
          </div>
        )}
        <p
          className={clsx([
            `mt-0.5 text-gray-500 text-xs`,
            isYour ? "text-right" : "text-left",
          ])}
        >
          {timeAgo(data.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default memo(MessageCard);
