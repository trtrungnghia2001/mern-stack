export type ThemeModeType = "light" | "dark" | "system";

// --- Định nghĩa kiểu dữ liệu cho Context ---
export interface IThemeContextProps {
  theme: ThemeModeType;
  setTheme: (theme: ThemeModeType) => void;
  toggleTheme: () => void;
}
