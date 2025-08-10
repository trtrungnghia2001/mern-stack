import { createContext, useCallback, useEffect, useState } from "react";
import type { IThemeContextProps, ThemeModeType } from "../types/theme.type";

const ThemeContext = createContext<IThemeContextProps | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeModeType>(() => {
    // Lấy theme từ localStorage hoặc mặc định là 'system'
    const storedTheme = localStorage.getItem("theme") as ThemeModeType;
    return storedTheme || "system";
  });

  // useEffect để theo dõi chế độ hệ thống
  useEffect(() => {
    // Hàm xử lý khi chế độ hệ thống thay đổi
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      // Nếu theme hiện tại là 'system', cập nhật lại
      if (theme === "system") {
        const newTheme = event.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    // Tạo MediaQueryList để lắng nghe thay đổi của hệ thống
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Dọn dẹp listener khi component unmount
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  // useEffect để cập nhật class trên thẻ <html> khi theme thay đổi
  useEffect(() => {
    const isDarkSystem = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const currentTheme =
      theme === "system" ? (isDarkSystem ? "dark" : "light") : theme;

    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sử dụng useCallback để tối ưu hóa hiệu suất
  const setTheme = useCallback((newTheme: ThemeModeType) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "system";
      return "light";
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
