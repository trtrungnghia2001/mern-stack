import NotFoundPage from "@/app/pages/notfound-page";
import { useRoutes } from "react-router-dom";
import UpdateMeForm from "../auth/components/UpdateMeForm";
import ChatLayout from "./components/ChatLayout";
import WelcomePanel from "./components/WelcomePanel";
import MessageContainer from "./components/MessageContainer";

const ChatRouter = () => {
  const routers = useRoutes([
    {
      path: "/",
      element: <ChatLayout />,
      children: [
        {
          path: "profile",
          element: (
            <div className="p-4">
              <UpdateMeForm />
            </div>
          ),
        },
        {
          path: "user",
          element: <WelcomePanel />,
        },
        {
          path: "group",
          element: <WelcomePanel />,
        },
        {
          path: "message/:id",
          element: <MessageContainer />,
        },
      ],
    },

    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return routers;
};

export default ChatRouter;
