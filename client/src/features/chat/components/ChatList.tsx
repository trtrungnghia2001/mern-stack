import { Button } from "@/shared/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import RoomForm from "./RoomForm";
import { useQuery } from "@tanstack/react-query";
import { roomConversationsApi } from "../apis/room.api";
import ContactCard from "./ContactCard";
import { useLocation } from "react-router-dom";

const ChatList = () => {
  const location = useLocation();

  const getConversationsResult = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (location.pathname.includes("group")) {
        return await roomConversationsApi();
      }
      return await roomConversationsApi();
    },
  });
  return (
    <div className="max-w-xs w-full border h-full overflow-hidden flex flex-col">
      {/* header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold">Chats</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} variant={"outline"}>
                <CirclePlus />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-6">Create Room</DialogTitle>
                <RoomForm />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* search */}
        <div className="flex items-center gap-3 border rounded-lg py-1.5 px-3">
          <Search size={14} />
          <input
            type="text"
            className="outline-none border-none w-full"
            placeholder="Chats search..."
          />
        </div>
      </div>

      {/* contact */}
      <ul className="flex-1 overflow-y-auto pb-4">
        {getConversationsResult.data?.data.map((item) => (
          <li key={item._id}>
            <ContactCard data={item} type="group" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(ChatList);
