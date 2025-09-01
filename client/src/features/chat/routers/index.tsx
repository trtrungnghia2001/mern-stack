import { memo } from "react";
import { useRoutes } from "react-router-dom";
import ChatPage from "../pages";

const ChatRouter = () => {
  const route = useRoutes([
    {
      index: true,
      element: <ChatPage />,
    },
    {
      path: "message",
      element: <ChatPage />,
    },
  ]);

  return route;
};

export default memo(ChatRouter);
