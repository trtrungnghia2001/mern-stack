import type { ComponentProps, FC } from "react";
import SidebarLeft from "./components/SidebarLeft";
import Nav from "./components/Nav";
import { ChatProvider } from "./context";

const ChatLayout: FC<ComponentProps<"div">> = ({ children }) => {
  return (
    <ChatProvider>
      <div className="flex h-screen">
        <Nav />
        <SidebarLeft />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </ChatProvider>
  );
};

export default ChatLayout;
