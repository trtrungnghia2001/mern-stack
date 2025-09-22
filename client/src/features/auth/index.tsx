import { memo } from "react";
import { useRoutes } from "react-router-dom";
import SignupSigninPage from "./pages/AuthenticationPage";
import UpdateMeForm from "./components/UpdateMeForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import AuthProtectedRoute from "@/app/routes/AuthProtectedRoute";
import NotFoundPage from "@/app/pages/notfound-page";

const AuthRouter = () => {
  const routers = useRoutes([
    {
      path: "signup",
      element: <SignupSigninPage />,
    },
    {
      path: "signin",
      element: <SignupSigninPage />,
    },
    {
      path: "forgot-password",
      element: <SignupSigninPage />,
    },
    {
      path: "reset-password",
      element: <SignupSigninPage />,
    },
    {
      element: <AuthProtectedRoute />,
      children: [
        {
          path: "update-me",
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

export default memo(AuthRouter);
