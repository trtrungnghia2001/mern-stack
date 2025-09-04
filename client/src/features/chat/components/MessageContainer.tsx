import { memo, useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/shared/components/ui/button";
import { Phone, Video } from "lucide-react";
import MessageCard from "./MessageCard";
import { useQuery } from "@tanstack/react-query";
import { messageRoomIdApi } from "../apis/message.api";
import { useParams } from "react-router-dom";
import { useMessageStore } from "../stores/message.store";

const user = useAuthStore.getState().user;

const MessageContainer = () => {
  const { id } = useParams();
  const { messages } = useMessageStore();
  const getMessageResult = useQuery({
    queryKey: ["message", id],
    queryFn: async () => {
      return await messageRoomIdApi(id as string, "");
    },
    enabled: !!id,
  });

  const messageScrollRef = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    messageScrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      {/* header */}
      <div className="border-b p-4 flex items-center justify-between gap-8">
        {/*  */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 aspect-square rounded-full overflow-hidden">
              <img
                src={user?.avatar}
                alt="avatar"
                loading="lazy"
                className="img"
              />
            </div>
            <div className="absolute bottom-0 right-0 outline outline-white w-2 aspect-square rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1">
            <h4 className="font-medium line-clamp-1">{user?.name}</h4>
            <div className="mt-0.5 text-green-500">online</div>
          </div>
        </div>
        {/*  */}
        <div className="space-x-2">
          <Button size={"sm"} variant={"outline"}>
            <Video />
          </Button>
          <Button size={"sm"} variant={"outline"}>
            <Phone />
          </Button>
          <Button size={"sm"} variant={"outline"}>
            <Video />
          </Button>
        </div>
      </div>
      {/* messages */}
      <ul className="flex-1 overflow-y-auto space-y-6 px-4">
        {getMessageResult.data?.data.concat(messages).map((item) => (
          <li key={item._id}>
            <MessageCard data={item} />
          </li>
        ))}
        <li ref={messageScrollRef}></li>
      </ul>
      <MessageInput />
    </div>
  );
};

export default memo(MessageContainer);
