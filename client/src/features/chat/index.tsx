import { useRoutes } from "react-router-dom";
import ChatLayout from "./layout";
import ChatPage from "./pages/ChatPage";
import UpdateMeForm from "../auth/components/UpdateMeForm";
import ChangePasswordForm from "../auth/components/ChangePasswordForm";
import RoomIdPage from "./pages/RoomIdPage";

const ChatRouter = () => {
  const route = useRoutes([
    {
      index: true,
      element: <ChatPage />,
    },
    {
      path: "messages/:roomId",
      element: <RoomIdPage />,
    },
    {
      path: "edit-profile",
      element: <UpdateMeForm className="p-4" />,
    },
    {
      path: "change-password",
      element: <ChangePasswordForm className="p-4" />,
    },
  ]);

  return <ChatLayout>{route}</ChatLayout>;
};

export default ChatRouter;
