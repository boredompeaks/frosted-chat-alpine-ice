
import React from "react";
import Settings from "@/components/settings/Settings";
import { useTheme } from "@/providers/ThemeProvider";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Settings onThemeChange={setTheme} currentTheme={theme} />
    </div>
  );
};

export default SettingsPage;
