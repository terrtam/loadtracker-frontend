/** Rules for session.
 *  Sanitizes numbers before storing into session state.
 *  Check if all required fields are filled for a set.
 */

import type { ExerciseSet } from "../types";

/**
 * Sanitizes numeric input before storing in session state.
 */
export function sanitizeNumber(
  value: number | undefined,
  { min = 0, max }: { min?: number; max?: number } = {}
): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;

  let v = value;
  if (min !== undefined) v = Math.max(min, v);
  if (max !== undefined) v = Math.min(max, v);

  return v;
}

/**
 * Checks whether all required fields for a set are filled.
 */
export function isSetFieldsComplete(
  set: ExerciseSet,
  completionRequires: string[]
): boolean {
  return completionRequires.every(
    (field) => typeof set.fields[field] === "number"
  );
}
