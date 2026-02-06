import { useCallback, useEffect, useState } from "react";

export type Theme = "day" | "night";

const STORAGE_KEY = "pos-theme";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "day";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "day";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "day" || stored === "night" ? stored : null;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => getStoredTheme() ?? getPreferredTheme(),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "day" ? "night" : "day"));
  }, []);

  return { theme, setTheme, toggleTheme };
}
