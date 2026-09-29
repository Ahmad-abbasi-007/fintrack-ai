"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

export default function ThemeProvider({
  children,
  initialTheme = "dark",
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");

  // Load theme from localStorage on mount (client override)
  useEffect(() => {
    const stored = localStorage.getItem("fintrack-theme") as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;

    function apply(t: Theme) {
      let final: "dark" | "light";

      if (t === "system") {
        final = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      } else {
        final = t;
      }

      root.classList.remove("dark", "light");
      root.classList.add(final);
      root.style.colorScheme = final;
      setResolvedTheme(final);
    }

    apply(theme);
    localStorage.setItem("fintrack-theme", theme);

    // Listen for system theme changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") apply("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("fintrack-theme", t);
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}