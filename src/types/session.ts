export type ExerciseSet = {
  id: string;
  exerciseCode: string;
  fields: Record<string, number | undefined>; // reps, weight, durationSeconds
  rpe?: number;
  completed: boolean;
  bodyPartProfileId?: number; // optional, for filtering by body part
};

export type Session = {
  id: string;
  date: string; // ISO string
  sets: ExerciseSet[];
};

export type SessionState = {
  date: string;
  setsByExercise: Record<string, ExerciseSet[]>;
};
