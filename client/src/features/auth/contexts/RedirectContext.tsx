// RedirectContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, type Location } from "react-router-dom";

// Xác định rõ kiểu context
interface RedirectContextType {
  redirectTo: Location | null;
  setRedirectTo: (loc: Location | null) => void;
}

// Mặc định initial context
const RedirectContext = createContext<RedirectContextType>({
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
  const [redirectTo, setRedirectTo] = useState<Location | null>(() => {
    const storedRedirect = sessionStorage.getItem("redirectTo");
    return storedRedirect ? JSON.parse(storedRedirect) : null;
  });
  const location = useLocation();

  useEffect(() => {
    const isAuthPath = authPaths.some((path) =>
      location.pathname.includes(path)
    );

    if (!isAuthPath) {
      setRedirectTo(location);
      sessionStorage.setItem("redirectTo", JSON.stringify(location));
    }
  }, [location]);

  return (
    <RedirectContext.Provider value={{ redirectTo, setRedirectTo }}>
      {children}
    </RedirectContext.Provider>
  );
};

export const useRedirect = () => useContext(RedirectContext);
