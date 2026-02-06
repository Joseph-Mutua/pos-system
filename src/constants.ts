import type { FocusableId } from "./components/posTypes";

/** Placeholder when a value is missing (e.g. no selection). */
export const EMPTY_DISPLAY = "\u2014";

/** Interval (ms) for simulated scale weight updates. */
export const SCALE_UPDATE_INTERVAL_MS = 700;

/** Delay (ms) before syncing outbox to history when coming back online. */
export const SYNC_OUTBOX_DELAY_MS = 700;

/** Minimum scale weight (lb) in simulation. */
export const SCALE_MIN_WEIGHT = 5000;

/** Max number of fuzzy matches to show in a single SearchField dropdown. */
export const SEARCH_FIELD_MATCH_LIMIT = 20;

/** Max number of matches to show in the command palette. */
export const COMMAND_PALETTE_MATCH_LIMIT = 40;

/** Single-key shortcuts to focus each search field (when not typing). */
export const FOCUS_KEY_MAP: Record<string, FocusableId> = {
  t: "truck",
  c: "customer",
  o: "order",
  p: "product",
} as const;

/** Hotkey list for the help modal. Order matches display. */
export const HOTKEY_ITEMS = [
  { key: "⌘+K", label: "Open command palette" },
  { key: "N", label: "New ticket" },
  { key: "⌘+T", label: "Focus truck search" },
  { key: "⌘+C", label: "Focus customer search" },
  { key: "⌘+O", label: "Focus order search" },
  { key: "⌘+P", label: "Focus product search" },
  { key: "F2 / G", label: "Capture gross weight" },
  { key: "F3 / T", label: "Capture tare weight" },
  { key: "F / ⌘+Enter", label: "Finalize ticket" },
  { key: "R", label: "Repeat last ticket" },
  { key: "P", label: "Repeat product" },
  { key: "O", label: "Toggle online mode" },
  { key: "⌘+Backspace", label: "Clear active search" },
] as const;

/** Number of recent transactions to show in the table. */
export const RECENT_TRANSACTIONS_LIMIT = 10;

/** Initial focus signal values (all zero). */
export const INITIAL_FOCUS_SIGNAL: Record<FocusableId, number> = {
  truck: 0,
  customer: 0,
  order: 0,
  product: 0,
};
