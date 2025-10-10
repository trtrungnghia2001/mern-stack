import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";
import { Ellipsis, Phone, Video } from "lucide-react";
import MessageInput from "../components/MessageInput";
import MessageCard from "../components/MessageCard";
import { useQuery } from "@tanstack/react-query";
import { useMessageStore } from "../stores/message.store";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useEffect, useMemo, useRef, useState } from "react";
import MessageCardSkeleton from "../components/MessageCardSkeleton";
import { useChatContext } from "../context";
import { useRoomStore } from "../stores/room.store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import clsx from "clsx";
import ProfileInfo from "../components/ProfileInfo";
import MediaList from "../components/MediaList";
import useSearchParamsValue from "@/shared/hooks/useSearchParamsValue";
import type { ResponseErrorType } from "@/shared/types/response";
import { toast } from "sonner";

const tabs = [
  { label: "About", value: "about" },
  { label: "Media", value: "media" },
];

const RoomIdPage = () => {
  const { roomId } = useParams();
  const { searchParams } = useSearchParamsValue();
  const _type = searchParams.get("_type") || "group";

  const [indexTabActive, setIndexTabActive] = useState("about");

  const { user } = useAuthStore();
  const { setCurrentRoomId, onlineUsers } = useChatContext();
  useEffect(() => {
    setCurrentRoomId(roomId as string);
  }, [roomId]);

  const { getId } = useRoomStore();
  const getRoomIdResult = useQuery({
    queryKey: ["chat", "room", roomId],
    queryFn: async () => await getId(roomId as string, _type),
    enabled: !!roomId,
  });
  const contactInfo = getRoomIdResult.data?.data;
  const isOnline = onlineUsers.includes(contactInfo?.userId as string);
  const isMember = contactInfo?.members.some((m) => m.user._id === user?._id);

  const { messages, getMessageByRoomId } = useMessageStore();
  const { isLoading, data, error } = useQuery({
    queryKey: ["chat", "room", "messages", roomId],
    queryFn: async () => await getMessageByRoomId(roomId as string),
    enabled: !!(roomId && isMember),
  });

  useEffect(() => {
    if (error && (error as unknown as ResponseErrorType).status === 403) {
      toast.error(error.message);
    }
  }, [error]);

  // scroll when new mess
  const bottomRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (!bottomRef.current) return;

    const lastMsg = messages[messages.length - 1];
    const isOwn = lastMsg?.sender?._id === user?._id;

    bottomRef.current.scrollIntoView({
      behavior: isOwn ? "auto" : "smooth",
    });
  }, [messages]);

  const customData = useMemo(() => {
    const messInRoom = messages.filter((m) => m.room === roomId);
    return data?.data.concat(messInRoom) || [];
  }, [messages, data, roomId]);

  if (!contactInfo) return;

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="border-b border-b-gray-200 p-4 flex items-center justify-between gap-8">
        {/* left */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 aspect-square rounded-full overflow-hidden">
              <img
                src={
                  contactInfo?.avatar ??
                  (contactInfo.type === "group"
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
          <div>
            <div className="font-medium text-13">{contactInfo.name}</div>
            <div className="text-gray-500 text-xs">
              {contactInfo.description}
            </div>
          </div>
        </div>
        {/* right */}
        {isMember && (
          <div className="flex items-center gap-2">
            <button title="Call" className="hover:bg-gray-200 p-2 rounded-lg">
              <Phone size={16} />
            </button>
            <button title="Call" className="hover:bg-gray-200 p-2 rounded-lg">
              <Video size={16} />
            </button>

            <Sheet>
              <SheetTrigger asChild>
                <button
                  title="Call"
                  className="hover:bg-gray-200 p-2 rounded-lg"
                >
                  <Ellipsis size={16} />
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Profile</SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="space-y-2">
                  <div className="mx-auto w-20 aspect-square rounded-full overflow-hidden">
                    <img
                      src={
                        contactInfo?.avatar ??
                        (contactInfo.type === "group"
                          ? IMAGE_NOTFOUND.group_notfound
                          : IMAGE_NOTFOUND.avatar_notfound)
                      }
                      alt="avatar"
                      loading="lazy"
                      className="img"
                    />
                  </div>
                  <div className="font-medium text-base text-center">
                    {contactInfo.name}
                  </div>
                  {/* tabs */}
                  <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
                    {tabs.map((tab) => (
                      <li key={tab.value}>
                        <button
                          className={clsx([
                            `font-medium pb-2`,
                            indexTabActive === tab.value
                              ? `text-blue-500 border-b-blue-500 border-b-2`
                              : `text-gray-500`,
                          ])}
                          onClick={() => setIndexTabActive(tab.value)}
                        >
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <>
                    {indexTabActive === "about" && (
                      <ProfileInfo contactInfo={contactInfo} />
                    )}
                    {indexTabActive === "media" && (
                      <MediaList roomId={roomId as string} />
                    )}
                  </>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
      {!isMember && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          You are not a member of this room
        </div>
      )}
      {customData.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Start chatting
        </div>
      )}

      {/* messages */}
      {isMember && (
        <ul className="flex-1 overflow-y-auto space-y-2">
          {isLoading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <li key={idx}>
                <MessageCardSkeleton />
              </li>
            ))}
          {!isLoading && (
            <>
              {customData.map((item) => (
                <li key={item._id}>
                  <MessageCard
                    isOwn={item.sender._id === user?._id}
                    message={item}
                  />
                </li>
              ))}
              <li ref={bottomRef}></li>
            </>
          )}
        </ul>
      )}

      {/* input */}
      {isMember && <MessageInput />}
    </div>
  );
};

export default RoomIdPage;
