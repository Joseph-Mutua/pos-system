import { memo, useEffect, useMemo, useRef, useState } from "react";
import { COMMAND_PALETTE_MATCH_LIMIT } from "../constants";
import styles from "./POSApp.module.css";
import type { Entity } from "./posTypes";
import { buildPaletteEntryHaystack, fuzzyScore } from "./posUtils";

export type PaletteEntity =
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

function scorePaletteEntry(query: string, entry: PaletteEntity): number {
  return fuzzyScore(query, buildPaletteEntryHaystack(entry.kind, entry.entity));
}

function CommandPalette({
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
      .map((item) => ({ item, score: scorePaletteEntry(query, item) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, COMMAND_PALETTE_MATCH_LIMIT);
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

  const listboxId = "command-palette-listbox";
  const activeOptionId = matches.length ? `command-palette-option-${active}` : undefined;

  return (
    <div
      className={styles.overlay}
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search anything"
    >
      <div
        className={styles.palette}
        onMouseDown={(e) => e.stopPropagation()}
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
            aria-label="Close command palette"
          >
            Close
          </button>
        </div>

        <div className={styles.paletteBody}>
          <input
            ref={inputRef}
            className={styles.paletteInput}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            aria-label="Search trucks, customers, orders, products"
            placeholder="Truck, customer, order, product..."
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
          />

          <div
            id={listboxId}
            className={styles.paletteResults}
            role="listbox"
            aria-label="Search results"
          >
            {matches.length ? (
              matches.map((item, index) => (
                <button
                  key={`${item.kind}-${item.entity.id}`}
                  id={index === active ? activeOptionId : undefined}
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  className={`${styles.paletteItem} ${
                    index === active ? styles.paletteItemActive : ""
                  }`}
                  onMouseEnter={() => setActive(index)}
                  onMouseDown={(e) => {
                    e.preventDefault();
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

export default memo(CommandPalette);
