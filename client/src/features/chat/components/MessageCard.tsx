import { memo, type FC } from "react";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";
import clsx from "clsx";
import type { IMessage } from "../types/message.type";

interface MessageCardProps {
  message: IMessage;
  isOwn: boolean;
}

const MessageCard: FC<MessageCardProps> = ({ isOwn, message }) => {
  return (
    <div
      className={clsx([`flex p-4`, isOwn ? "justify-end" : "justify-start"])}
    >
      <div className="space-y-2 w-[40%]">
        {/* top */}
        <div
          className={clsx([
            "flex items-center gap-2",
            isOwn ? "justify-end" : "justify-start",
          ])}
        >
          <div className="w-5 aspect-square rounded-full overflow-hidden">
            <img
              src={message.sender.avatar || IMAGE_NOTFOUND.avatar_notfound}
              alt="avatar"
              loading="lazy"
              className="img"
            />
          </div>
          <div className="space-y-0.5">
            <div className="font-medium text-xs text-gray-500">
              {message.sender.name}
            </div>
            <div className="text-[10px] text-gray-500 italic">
              {new Date(message.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        {/* attachments */}
        {message.attachments && (
          <div
            className={clsx([`flex`, isOwn ? "justify-end" : "justify-start"])}
          >
            <ul
              className={clsx([
                `grid gap-2`,
                message.attachments.length === 1
                  ? "grid-cols-1"
                  : message.attachments.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3",
              ])}
            >
              {message.attachments.map((att) => (
                <li
                  key={att.url}
                  className="w-full aspect-square rounded-lg overflow-hidden"
                >
                  {att.resource_type === "image" && (
                    <img src={att.url} loading="lazy" className="img" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* text */}
        {message.text && (
          <div
            className={clsx([`flex`, isOwn ? "justify-end" : "justify-start"])}
          >
            <div
              className={clsx([
                "p-2 rounded-lg w-max",
                isOwn ? "bg-blue-500 text-white " : "bg-gray-200",
              ])}
            >
              {message.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MessageCard);
