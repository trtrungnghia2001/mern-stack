import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/home-page";
import SearchPage from "../pages/search-page";
import NotFoundPage from "../pages/notfound-page";
import SignupSigninPage from "@/features/auth/pages/SignupSigninPage";
import AuthProtectedRoute from "./AuthProtectedRoute";
import UpdateMeForm from "@/features/auth/components/UpdateMeForm";
import ChangePasswordForm from "@/features/auth/components/ChangePasswordForm";
import UploadPage from "../pages/upload-page";

const MainRouter = () => {
  return (
    <Routes>
      {/* public */}
      <Route index element={<HomePage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="upload" element={<UploadPage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* auth */}
      <Route path="signin" element={<SignupSigninPage />} />
      <Route path="signup" element={<SignupSigninPage />} />
      <Route path="forgot-password" element={<SignupSigninPage />} />
      <Route path="reset-password" element={<SignupSigninPage />} />

      {/* auth protected */}
      <Route element={<AuthProtectedRoute />}>
        {/* user */}
        <Route path="me">
          <Route path="update-me" element={<UpdateMeForm />} />
          <Route path="change-password" element={<ChangePasswordForm />} />
        </Route>
        {/* admin */}
      </Route>
    </Routes>
  );
};

export default memo(MainRouter);
