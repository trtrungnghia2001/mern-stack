import NotFoundPage from "@/app/pages/notfound-page";
import { useRoutes } from "react-router-dom";
import KanbanLayout from "./KanbanLayout";
import BoardsPage from "./pages/BoardsPage";
import BoardIdPage from "./pages/BoardIdPage";
import TaskModel from "./components/TaskModel";
import WorkspacesPage from "./pages/WorkspacesPage";
import WorkspaceIdPage from "./pages/WorkspaceIdPage";
import YouBoardPage from "./pages/YouBoardPage";
import MemberPage from "./pages/MemberPage";
import DashboardPage from "./pages/DashboardPage";
import UpdateMeForm from "../auth/components/UpdateMeForm";
import ChangePasswordForm from "../auth/components/ChangePasswordForm";

const KanbanRouter = () => {
  const routers = useRoutes([
    {
      element: <KanbanLayout />,
      children: [
        {
          index: true,
          path: "dashboard",
          element: <DashboardPage />,
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
          path: "workspaces",
          element: <WorkspacesPage />,
        },
        {
          path: "workspace/:id",
          element: <WorkspaceIdPage />,
        },
        {
          path: "your-board",
          element: <YouBoardPage />,
        },
        {
          path: "members",
          element: <MemberPage />,
        },
        {
          path: "update-profile",
          element: <UpdateMeForm />,
        },
        {
          path: "change-password",
          element: <ChangePasswordForm />,
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
