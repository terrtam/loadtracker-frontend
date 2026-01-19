export function formatNumber(value: number | null) {
  if (value == null) return "—";
  return value.toFixed(1);
}
