import { useEffect } from "react";
import styles from "./HotkeysModal.module.css";

const shortcuts = [
  { keys: "⌘ K", desc: "Open Truck search" },
  { keys: "⌘ J", desc: "Open Customer search" },
  { keys: "⌘ O", desc: "Open Order search" },
  { keys: "⌘ P", desc: "Open Product search" },
  { keys: "Tab", desc: "Next field (when search open)" },
  { keys: "↑ ↓", desc: "Move in list" },
  { keys: "Enter", desc: "Select highlighted" },
  { keys: "Esc", desc: "Close search" },
  { keys: "⌘ ↵", desc: "Print ticket" },
];

interface HotkeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HotkeysModal({ isOpen, onClose }: HotkeysModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotkeys-title"
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="hotkeys-title" className={styles.title}>
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            Esc
          </button>
        </div>
        <ul className={styles.list}>
          {shortcuts.map((s, i) => (
            <li key={i} className={styles.item}>
              <kbd className={styles.kbd}>{s.keys}</kbd>
              <span className={styles.desc}>{s.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
