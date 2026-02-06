import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./POSApp.module.css";
import type { Entity, FocusableId } from "./posTypes";
import { toDisplay } from "./posUtils";

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

function fuzzyScore(query: string, entity: Entity) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return 1;

  const haystack = [
    entity.id,
    entity.code,
    entity.name,
    ...(entity.aliases ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (haystack.startsWith(normalized)) return 120;
  if (haystack.includes(normalized)) return 90;

  let qIndex = 0;
  let score = 0;

  for (let i = 0; i < haystack.length && qIndex < normalized.length; i += 1) {
    if (haystack[i] === normalized[qIndex]) {
      qIndex += 1;
      score += 3;
    }
  }

  if (qIndex !== normalized.length) return 0;

  score += Math.max(0, 40 - (haystack.length - normalized.length));
  return score;
}

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

export default function SearchField({
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
      .map((item) => ({ item, score: fuzzyScore(query, item) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
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

  const handleSelect = (item: Entity | null) => {
    onSelect(item);
    setQuery("");
    setOpen(false);
  };

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
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {open && (
          <div className={styles.dropdown}>
            {filtered.length ? (
              filtered.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
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
      <p className={styles.fieldMeta}>Selected: {toDisplay(selected)}</p>
    </div>
  );
}
