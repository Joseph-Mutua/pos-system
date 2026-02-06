import type { Entity } from "./posTypes";

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

export function toDisplay(entity: Entity | null) {
  return entity
    ? `${entity.code} \u00b7 ${entity.name}`
    : "\u2014";
}

export function pounds(value: number) {
  return `${value.toLocaleString()} lb`;
}

export function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  } as Intl.DateTimeFormatOptions);
}

export function entityById(list: Entity[], id: string) {
  return list.find((item) => item.id === id);
}

// ---------------------------------------------------------------------------
// Fuzzy search (shared algorithm for SearchField and CommandPalette)
// ---------------------------------------------------------------------------

/**
 * Scores how well `query` matches `haystack` (both lowercased).
 * Higher = better match. Returns 0 if no match.
 */
export function fuzzyScore(query: string, haystack: string): number {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return 1;

  const h = haystack.toLowerCase();
  if (h.startsWith(normalized)) return 120;
  if (h.includes(normalized)) return 90;

  let qIndex = 0;
  let score = 0;
  for (let i = 0; i < h.length && qIndex < normalized.length; i += 1) {
    if (h[i] === normalized[qIndex]) {
      qIndex += 1;
      score += 3;
    }
  }

  if (qIndex !== normalized.length) return 0;
  score += Math.max(0, 40 - (h.length - normalized.length));
  return score;
}

/** Builds a single searchable string from an entity (for fuzzy match). */
export function buildEntityHaystack(entity: Entity): string {
  return [
    entity.id,
    entity.code,
    entity.name,
    ...(entity.aliases ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

/** Builds a single searchable string from a palette entry (kind + entity). */
export function buildPaletteEntryHaystack(kind: string, entity: Entity): string {
  return [
    kind,
    entity.id,
    entity.code,
    entity.name,
    ...(entity.aliases ?? []),
  ]
    .join(" ")
    .toLowerCase();
}
