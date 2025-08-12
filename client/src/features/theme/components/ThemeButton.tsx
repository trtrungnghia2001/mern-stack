import { Switch } from "@/shared/components/ui/switch";
import { memo } from "react";
import { useThemeContext } from "../contexts/theme.context";

const ThemeButton = () => {
  const { theme, toggleTheme } = useThemeContext();
  return <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />;
};

export default memo(ThemeButton);
