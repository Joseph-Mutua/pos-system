import { useEffect, useState } from "react";

export type Theme = "day" | "night";

const storageKey = "pos-theme";

const getPreferredTheme = () => {
  if (typeof window === "undefined") return "day";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "day";
};

const getStoredTheme = () => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(storageKey);
  return stored === "day" || stored === "night" ? stored : null;
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return getStoredTheme() ?? getPreferredTheme();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "day" ? "night" : "day"));
  };

  return { theme, setTheme, toggleTheme };
}
