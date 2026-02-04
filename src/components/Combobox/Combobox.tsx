import { useEffect } from "react";
import styles from "./Combobox.module.css";

export interface ComboboxField {
  label: string;
  value: string;
  mono?: boolean;
}

export interface ComboboxItem {
  id: string;
  fields: ComboboxField[];
}

interface ComboboxProps {
  label: string;
  shortcut: string;
  /** Display value when closed */
  displayValue: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  items: ComboboxItem[];
  highlightedIndex: number;
  onHighlight: (index: number) => void;
  onSelect: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  /** Placeholder when open */
  placeholder?: string;
  /** Accessibility: unique id for listbox */
  listboxId: string;
  /** Accessibility: unique id for input */
  inputId: string;
}

export function Combobox({
  label,
  shortcut,
  displayValue,
  isOpen,
  onOpen,
  onClose,
  searchQuery,
  onSearchChange,
  items,
  highlightedIndex,
  onHighlight,
  onSelect,
  onKeyDown,
  inputRef,
  listRef,
  placeholder = "Search...",
  listboxId,
  inputId,
}: ComboboxProps) {
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, inputRef]);

  useEffect(() => {
    if (!listRef.current) return;
    const highlighted = listRef.current.querySelector(
      `.${styles.dropdownItemHighlighted}`
    );
    if (highlighted) {
      highlighted.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, listRef]);

  if (isOpen) {
    return (
      <div className={styles.fieldSearchMode}>
        <div className={styles.searchHeader}>
          <span className={styles.searchLabel}>{label}</span>
          <span className={styles.shortcut}>{shortcut}</span>
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => setTimeout(onClose, 150)}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={true}
          aria-activedescendant={
            items[highlightedIndex]
              ? `${listboxId}-${items[highlightedIndex].id}`
              : undefined
          }
          role="combobox"
          aria-label={`Search ${label.toLowerCase()}`}
        />
        {items.length > 0 && (
          <div
            ref={listRef}
            id={listboxId}
            className={styles.dropdown}
            role="listbox"
            aria-label={`${label} results`}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                id={`${listboxId}-${item.id}`}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`${styles.dropdownItem} ${
                  index === highlightedIndex
                    ? styles.dropdownItemHighlighted
                    : ""
                }`}
                onClick={() => onSelect(item.id)}
                onMouseEnter={() => onHighlight(index)}
              >
                {item.fields.map((f, i) => (
                  <span
                    key={i}
                    className={`${styles.dropdownField} ${
                      f.mono ? styles.mono : ""
                    }`}
                  >
                    <span className={styles.dropdownFieldLabel}>{f.label}</span>
                    <span className={styles.dropdownFieldValue}>{f.value}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={styles.fieldInput}>
        <div className={styles.fieldLabel}>
          <span>{label}</span>
          <span className={styles.shortcut}>{shortcut}</span>
        </div>
        <button
          type="button"
          className={styles.input}
          onClick={onOpen}
          aria-haspopup="listbox"
          aria-expanded={false}
          aria-label={`Select ${label.toLowerCase()}. ${shortcut} to open.`}
        >
          <span className={styles.inputValue}>{displayValue}</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </>
  );
}
