import { memo } from "react";
import { useRoutes } from "react-router-dom";
import UploadPage from "@/app/pages/upload-page";
import NotFoundPage from "@/app/pages/notfound-page";

const UploadRouter = () => {
  const routers = useRoutes([
    {
      index: true,
      element: <UploadPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return routers;
};

export default memo(UploadRouter);
