import NotFoundPage from "@/app/pages/notfound-page";
import { useRoutes } from "react-router-dom";
import KanbanLayout from "./KanbanLayout";
import BoardsPage from "./pages/BoardsPage";
import TeamplatesPage from "./pages/TeamplatesPage";
import WorkspaceBoardPage from "./pages/WorkspaceBoardPage";
import WorkspaceMemberPage from "./pages/WorkspaceMemberPage";
import WorkspaceSettingPage from "./pages/WorkspaceSettingPage";
import WorkspacePayPage from "./pages/WorkspacePayPage";
import BoardIdPage from "./pages/BoardIdPage";
import TaskModel from "./components/TaskModel";
import Dashboard from "./pages/Dashboard";

const KanbanRouter = () => {
  const routers = useRoutes([
    {
      element: <KanbanLayout />,
      children: [
        {
          index: true,
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "boards",
          element: <BoardsPage />,
        },
        {
          path: "board/:boardId",
          element: <BoardIdPage />,
          children: [
            {
              path: "task/:taskId",
              element: <TaskModel />,
            },
          ],
        },
        {
          path: "templates",
          element: <TeamplatesPage />,
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
