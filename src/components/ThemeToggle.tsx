"use client";

import { useTheme } from "@/components/ThemeProvider";
import { updateSettings } from "@/app/dashboard/settings-actions";
import { useEffect } from "react";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  function handleToggle() {
    const next: "dark" | "light" =
      resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);

    // Persist to DB (fire and forget)
    const fd = new FormData();
    fd.set("theme", next);
    updateSettings(fd).catch(() => {});
  }

  return (
    <button
      onClick={handleToggle}
      className="w-10 h-10 rounded-full hover:bg-gray-800/50 dark:hover:bg-gray-800 light:hover:bg-gray-200 flex items-center justify-center transition"
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="text-lg">
        {resolvedTheme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
}