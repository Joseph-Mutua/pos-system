import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./POSApp.module.css";
import type { Entity } from "./posTypes";

type PaletteEntity =
  | { kind: "TRUCK"; entity: Entity }
  | { kind: "CUSTOMER"; entity: Entity }
  | { kind: "ORDER"; entity: Entity }
  | { kind: "PRODUCT"; entity: Entity };

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  trucks: Entity[];
  customers: Entity[];
  orders: Entity[];
  products: Entity[];
  onPick: (entry: PaletteEntity) => void;
};

const scoreEntity = (query: string, entry: PaletteEntity) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return 1;

  const haystack = [
    entry.kind,
    entry.entity.id,
    entry.entity.code,
    entry.entity.name,
    ...(entry.entity.aliases ?? []),
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
};

export default function CommandPalette({
  open,
  onClose,
  trucks,
  customers,
  orders,
  products,
  onPick,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const all = useMemo<PaletteEntity[]>(
    () => [
      ...trucks.map((entity): PaletteEntity => ({ kind: "TRUCK", entity })),
      ...customers.map((entity): PaletteEntity => ({ kind: "CUSTOMER", entity })),
      ...orders.map((entity): PaletteEntity => ({ kind: "ORDER", entity })),
      ...products.map((entity): PaletteEntity => ({ kind: "PRODUCT", entity })),
    ],
    [trucks, customers, orders, products],
  );

  const matches = useMemo(() => {
    const scored = all
      .map((item) => ({ item, score: scoreEntity(query, item) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);
    return scored.map(({ item }) => item);
  }, [all, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const raf = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.palette}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.paletteHeader}>
          <div>
            <div className={styles.paletteTitle}>Search anything</div>
            <div className={styles.paletteHint}>
              ⌘+K to open, Esc to close, Enter to pick.
            </div>
          </div>
          <button
            type="button"
            className={styles.paletteClose}
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className={styles.paletteBody}>
          <input
            ref={inputRef}
            className={styles.paletteInput}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
              }
              if (!matches.length) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((prev) => Math.min(prev + 1, matches.length - 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((prev) => Math.max(prev - 1, 0));
              }
              if (event.key === "Enter") {
                event.preventDefault();
                const pick = matches[active] ?? matches[0];
                if (pick) {
                  onPick(pick);
                  onClose();
                }
              }
            }}
            placeholder="Truck, customer, order, product..."
          />

          <div className={styles.paletteResults} role="listbox">
            {matches.length ? (
              matches.map((item, index) => (
                <button
                  key={`${item.kind}-${item.entity.id}`}
                  type="button"
                  className={`${styles.paletteItem} ${
                    index === active ? styles.paletteItemActive : ""
                  }`}
                  onMouseEnter={() => setActive(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onPick(item);
                    onClose();
                  }}
                >
                  <div>
                    <div className={styles.paletteItemTitle}>
                      {item.entity.code} - {item.entity.name}
                    </div>
                    <div className={styles.paletteItemMeta}>
                      {item.kind}
                      {item.entity.aliases?.length ? " - " : ""}
                      {item.entity.aliases?.slice(0, 2).join(", ")}
                    </div>
                  </div>
                  <span className={styles.paletteTag}>{item.kind}</span>
                </button>
              ))
            ) : (
              <div className={styles.paletteEmpty}>No matches</div>
            )}
          </div>

          <div className={styles.paletteHelp}>
            <div>
              <strong>N</strong> new ticket, <strong>G/T</strong> capture,
              <strong>F</strong> finalize
            </div>
            <div>
              <strong>R</strong> repeat last, <strong>P</strong> repeat product,
              <strong>O</strong> toggle online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
