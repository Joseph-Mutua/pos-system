import { useEffect, useRef } from "react";

/**
 * Register a keyboard shortcut. Uses metaKey on Mac (⌘) and ctrlKey on Windows/Linux.
 */
export function useKeyboardShortcut(
  key: string,
  handler: (e: KeyboardEvent) => void,
  options?: { enabled?: boolean }
): void {
  const enabled = options?.enabled ?? true;
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      const keyLower = key.toLowerCase();
      const match = e.key.toLowerCase() === keyLower && isMod;
      if (match) {
        e.preventDefault();
        handlerRef.current(e);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, enabled, handler]);
}
