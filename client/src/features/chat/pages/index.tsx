import { Outlet } from "react-router-dom";
import ChatList from "../components/ChatList";
import SideNavigate from "../components/SideNavigate";

const ChatPage = () => {
  return (
    <div className="flex">
      <SideNavigate />
      <ChatList />
      <div className="w-full h-screen overflow-y-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatPage;
