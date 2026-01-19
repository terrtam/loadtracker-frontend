export type BodyPartCode = string;
export type ExerciseCode = string;
export type ExerciseType = string;
export type SetTypeCode = string;

export interface SetFieldConfig {
  type: "number";
  required: boolean;
}

export interface SetTypeConfig {
  fields: Record<string, SetFieldConfig>;
  completionRequires: string[];
}

export interface ExerciseConfig {
  name: string;
  type: ExerciseType;
  bodyParts: BodyPartCode[];
}

export interface AppConfig {
  version: string;

  bodyParts: Record<BodyPartCode, string>;
  exerciseTypes: Record<ExerciseType, string>;

  setTypes: Record<SetTypeCode, SetTypeConfig>;
  setTypeByExerciseType: Record<ExerciseType, SetTypeCode>;

  exercises: Record<ExerciseCode, ExerciseConfig>;
}
