// RedirectContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, type Location } from "react-router-dom";

type RedirectType = Location | null;

// Xác định rõ kiểu context
interface IRedirectContext {
  redirectTo: RedirectType;
  setRedirectTo: (loc: RedirectType) => void;
}

// Mặc định initial context
const RedirectContext = createContext<IRedirectContext>({
  redirectTo: null,
  setRedirectTo: () => {},
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
  const [redirectTo, setRedirectTo] = useState<RedirectType>(() => {
    const storedRedirect = sessionStorage.getItem("redirectTo");
    return storedRedirect ? JSON.parse(storedRedirect) : null;
  });
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

  return (
    <RedirectContext.Provider value={{ redirectTo, setRedirectTo }}>
      {children}
    </RedirectContext.Provider>
  );
};

export const useRedirectContext = () => useContext(RedirectContext);
