import { memo } from "react";
import styles from "./POSApp.module.css";
import type { Theme } from "../hooks/useTheme";

type ThemeToggleProps = {
  theme: Theme;
  onToggle: () => void;
};

function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isNight = theme === "night";
  return (
    <button
      type="button"
      onClick={onToggle}
      className={styles.themeToggle}
      aria-pressed={isNight}
      aria-label="Toggle day and night mode"
    >
      {isNight ? (
        <svg
          className={styles.themeIcon}
          viewBox="0 0 24 24"
          aria-hidden
          focusable="false"
        >
          <path
            d="M21 14.5a9 9 0 1 1-11.5-11 7 7 0 1 0 11.5 11Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          className={styles.themeIcon}
          viewBox="0 0 24 24"
          aria-hidden
          focusable="false"
        >
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <path
            d="M12 2.2v3.1M12 18.7v3.1M4.2 12h3.1M16.7 12h3.1M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}

export default memo(ThemeToggle);
