import { memo } from "react";
import { Outlet } from "react-router-dom";
import SideNavigate from "./SideNavigate";
import ChatList from "./ChatList";

const ChatLayout = () => {
  return (
    <div className="flex h-screen">
      <SideNavigate />
      <ChatList />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default memo(ChatLayout);
