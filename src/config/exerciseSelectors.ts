import type { AppConfig } from "../types/appConfig";

export type ExerciseWithCode = {
  code: string;
  name: string;
  type: string;
  bodyParts: string[];
};

export function getExercisesForBodyPart(
  config: AppConfig,
  bodyPartId: string
): ExerciseWithCode[] {
  return Object.entries(config.exercises)
    .map(([code, exercise]) => ({
      code,
      ...exercise
    }))
    .filter(exercise =>
      exercise.bodyParts.includes(bodyPartId)
    );
}
