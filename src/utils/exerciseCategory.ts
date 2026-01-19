export type LoadCategory =
  | "strength"
  | "plyometric"
  | "isometric"
  | "cardio";

/**
 * Classification is config-driven, NOT inferred from fields.
 * This prevents silent logic drift.
 */
export function classifyExercise(
  exerciseCode: string
): LoadCategory | null {
  if (exerciseCode.startsWith("STR_")) return "strength";
  if (exerciseCode.startsWith("PLY_")) return "plyometric";
  if (exerciseCode.startsWith("ISO_")) return "isometric";
  if (exerciseCode.startsWith("CAR_")) return "cardio";

  return null;
}
