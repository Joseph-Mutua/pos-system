import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SEARCH_FIELD_MATCH_LIMIT } from "../constants";
import styles from "./POSApp.module.css";
import type { Entity, FocusableId } from "./posTypes";
import { buildEntityHaystack, fuzzyScore, toDisplay } from "./posUtils";

type SearchFieldProps = {
  id: FocusableId;
  label: string;
  placeholder: string;
  options: Entity[];
  selected: Entity | null;
  onSelect: (value: Entity | null) => void;
  hotkey: string;
  requestFocusSignal: number;
};

function renderHighlight(text: string, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return text;
  const lower = text.toLowerCase();
  const index = lower.indexOf(normalized);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className={styles.highlight}>
        {text.slice(index, index + normalized.length)}
      </span>
      {text.slice(index + normalized.length)}
    </>
  );
}

function SearchField({
  id,
  label,
  placeholder,
  options,
  selected,
  onSelect,
  hotkey,
  requestFocusSignal,
}: SearchFieldProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const scored = options
      .map((item) => ({ item, score: fuzzyScore(query, buildEntityHaystack(item)) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, SEARCH_FIELD_MATCH_LIMIT);
    return scored.map(({ item }) => item);
  }, [options, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!requestFocusSignal) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [requestFocusSignal]);

  const handleSelect = useCallback(
    (item: Entity | null) => {
      onSelect(item);
      setQuery("");
      setOpen(false);
    },
    [onSelect],
  );

  const dropdownId = `${id}-listbox`;
  const activeOptionId = filtered.length ? `${id}-option-${activeIndex}` : undefined;

  return (
    <div className={styles.card}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}
        <span className={styles.hotkeyBadge}>{hotkey}</span>
      </label>
      <div className={styles.fieldControl}>
        <input
          ref={inputRef}
          id={id}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={dropdownId}
          aria-activedescendant={activeOptionId}
          aria-label={label}
          onKeyDown={(e) => {
            if (
              (e.ctrlKey || e.metaKey) &&
              e.key.toLowerCase() === "backspace"
            ) {
              e.preventDefault();
              handleSelect(null);
              return;
            }

            if (!open && e.key === "ArrowDown") {
              setOpen(true);
              return;
            }

            if (!filtered.length) return;

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((prev) => (prev + 1) % filtered.length);
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex(
                (prev) => (prev - 1 + filtered.length) % filtered.length,
              );
            }
            if (e.key === "Enter") {
              e.preventDefault();
              const pick = filtered[activeIndex] ?? filtered[0];
              if (pick) {
                handleSelect(pick);
              }
            }
            if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className={styles.fieldInput}
          placeholder={placeholder}
        />
        {open && (
          <div
            id={dropdownId}
            className={styles.dropdown}
            role="listbox"
            aria-label={`${label} suggestions`}
          >
            {filtered.length ? (
              filtered.map((item, index) => (
                <button
                  key={item.id}
                  id={`${id}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                  className={`${styles.dropdownItem} ${
                    index === activeIndex ? styles.dropdownItemActive : ""
                  }`}
                >
                  <span>{renderHighlight(item.code, query)}</span>
                  <span>{renderHighlight(item.name, query)}</span>
                </button>
              ))
            ) : (
              <p className={styles.dropdownEmpty}>No matches</p>
            )}
          </div>
        )}
      </div>
      <p className={styles.fieldMeta} aria-live="polite">
        Selected: {toDisplay(selected)}
      </p>
    </div>
  );
}

export default memo(SearchField);
