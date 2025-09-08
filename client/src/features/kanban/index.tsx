import NotFoundPage from "@/app/pages/notfound-page";
import { useRoutes } from "react-router-dom";
import KanbanLayout from "./KanbanLayout";
import BoardsPage from "./pages/BoardsPage";
import TeamplatesPage from "./pages/TeamplatesPage";
import HomePage from "./pages/HomePage";
import WorkspaceBoardPage from "./pages/WorkspaceBoardPage";
import WorkspaceMemberPage from "./pages/WorkspaceMemberPage";
import WorkspaceSettingPage from "./pages/WorkspaceSettingPage";
import WorkspacePayPage from "./pages/WorkspacePayPage";
import BoardIdPage from "./pages/BoardIdPage";

const KanbanRouter = () => {
  const routers = useRoutes([
    {
      element: <KanbanLayout />,
      children: [
        {
          path: "boards",
          element: <BoardsPage />,
        },
        {
          path: "board/:id",
          element: <BoardIdPage />,
        },
        {
          path: "templates",
          element: <TeamplatesPage />,
        },
        {
          index: true,
          path: "home",
          element: <HomePage />,
        },
        {
          path: "workspace",
          children: [
            {
              path: "home",
              element: <WorkspaceBoardPage />,
            },
            {
              path: "menber",
              element: <WorkspaceMemberPage />,
            },
            {
              path: "setting",
              element: <WorkspaceSettingPage />,
            },
            {
              path: "pay",
              element: <WorkspacePayPage />,
            },
          ],
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

export default KanbanRouter;
