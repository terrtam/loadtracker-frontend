/** Classifies an exercise into a load category based on its code prefix.*/

export type LoadCategory =
  | "strength"
  | "plyometric"
  | "isometric"
  | "cardio";

export function classifyExercise(
  exerciseCode: string
): LoadCategory | null {
  if (exerciseCode.startsWith("STR_")) return "strength";
  if (exerciseCode.startsWith("PLY_")) return "plyometric";
  if (exerciseCode.startsWith("ISO_")) return "isometric";
  if (exerciseCode.startsWith("CAR_")) return "cardio";

  return null;
}
