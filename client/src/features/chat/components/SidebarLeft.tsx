import { Button } from "@/shared/components/ui/button";
import clsx from "clsx";
import { CirclePlus, Search } from "lucide-react";
import { memo } from "react";
import MessageCard from "./MessageCard";
import { dataSidebar } from "../data";

const SidebarLeft = () => {
  return (
    <div className="max-w-xs w-full rounded border h-screen overflow-hidden flex flex-col">
      {/* header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold">Chats</h4>
          <Button size={"sm"} variant={"outline"}>
            <CirclePlus />
            New
          </Button>
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

      {/* users */}
      <ul className="flex-1 overflow-auto pb-4">
        {dataSidebar.map((item) => (
          <li
            key={item._id}
            className={clsx([item._id === dataSidebar[4]._id && `bg-gray-100`])}
          >
            <MessageCard data={item} />
          </li>
        ))}
      </ul>
      {/* groups */}
      <div></div>
    </div>
  );
};

export default memo(SidebarLeft);
