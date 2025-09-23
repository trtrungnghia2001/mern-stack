import type { ComponentProps, FC } from "react";
import SidebarLeft from "./components/SidebarLeft";
import SidebarRight from "./components/SidebarRight";
import Nav from "./components/Nav";

const ChatLayout: FC<ComponentProps<"div">> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Nav />
      <SidebarLeft />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <SidebarRight />
    </div>
  );
};

export default ChatLayout;
