/**
 * Fuzzy match: query characters must appear in text in order (subsequence).
 * Case-insensitive. Used for fast client-side filtering.
 */
export function fuzzyMatch(text: string, query: string): boolean {
  if (!query.trim()) return true;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  let qi = 0;
  for (let i = 0; i < lowerText.length && qi < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[qi]) qi++;
  }
  return qi === lowerQuery.length;
}

/**
 * Match multiple fields — true if any field fuzzy-matches the query.
 */
export function fuzzyMatchFields(fields: string[], query: string): boolean {
  if (!query.trim()) return true;
  return fields.some((f) => fuzzyMatch(f, query));
}
