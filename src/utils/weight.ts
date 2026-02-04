/** Round to nearest scale increment (e.g. 20 lbs). */
export function roundToIncrement(
  value: number,
  increment: number = 20
): number {
  return Math.round(value / increment) * increment;
}

export function formatWeight(lbs: number): { lbs: string; tons: string } {
  const rounded = roundToIncrement(lbs);
  return {
    lbs: rounded.toLocaleString(),
    tons: (rounded / 2000).toFixed(2),
  };
}
