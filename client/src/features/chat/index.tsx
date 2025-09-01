import NotFoundPage from "@/app/pages/notfound-page";
import { useRoutes } from "react-router-dom";

const ChatRouter = () => {
  const routers = useRoutes([
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return routers;
};

export default ChatRouter;
