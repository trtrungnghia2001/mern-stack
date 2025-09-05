// RedirectContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import type { IUser } from "../types/auth";

// Xác định rõ kiểu context
interface IRedirectContext {
  handleRedirectWhenSignInSuccess: (data: IUser) => void;
}

// Mặc định initial context
const RedirectContext = createContext<IRedirectContext>({
  handleRedirectWhenSignInSuccess: () => {},
});

const authPaths = [
  "signin",
  "signup",
  "forgot-password",
  "reset-password",
  "verify-email",
];

export const RedirectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [redirectTo, setRedirectTo] = useState<Location | null>(() => {
    const storedRedirect = sessionStorage.getItem("redirectTo");
    return storedRedirect ? JSON.parse(storedRedirect) : null;
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra nếu đường dẫn hiện tại không phải là một trong các đường dẫn auth
  // thì cập nhật redirectTo với đường dẫn hiện tại
  useEffect(() => {
    const isAuthPath = authPaths.some((path) =>
      location.pathname.includes(path)
    );

    if (!isAuthPath) {
      setRedirectTo(location);
    }
  }, [location]);

  // Lưu redirectTo vào sessionStorage mỗi khi nó thay đổi
  // Điều này giúp giữ nguyên redirectTo khi người dùng refresh trang
  useEffect(() => {
    if (redirectTo) {
      sessionStorage.setItem("redirectTo", JSON.stringify(redirectTo));
    } else {
      sessionStorage.removeItem("redirectTo");
    }
  }, [redirectTo]);

  const handleRedirectWhenSignInSuccess = (data: IUser) => {
    if (redirectTo) {
      navigate(redirectTo.pathname + redirectTo.search, { replace: true });
      setRedirectTo(null);
    } else {
      if (data.role === "admin") {
        navigate(`/admin`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <RedirectContext.Provider value={{ handleRedirectWhenSignInSuccess }}>
      {children}
    </RedirectContext.Provider>
  );
};

export const useRedirectContext = () => useContext(RedirectContext);
