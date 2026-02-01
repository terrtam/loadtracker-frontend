/** Formats numbers to one decimal place.
 *  Dash if no data.
 */

export function formatNumber(value: number | null) {
  if (value == null) return "—";
  return value.toFixed(1);
}
