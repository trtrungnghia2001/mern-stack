import { useRoutes } from "react-router-dom";
import ChatLayout from "./layout";
import ChatPage from "./pages/ChatPage";
import MessageIdPage from "./pages/MessageIdPage";

const ChatRouter = () => {
  const route = useRoutes([
    {
      index: true,
      element: <ChatPage />,
    },
    {
      path: "messages/:messageId",
      element: <MessageIdPage />,
    },
  ]);

  return <ChatLayout>{route}</ChatLayout>;
};

export default ChatRouter;
