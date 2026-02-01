/**
 * Types for a session.
 * `ExerciseSet` represents single set.
 * `Session` represents a workout session on a specific date, containing multiple sets.
 * `SessionState` is state structure organizing sets by exercise code. */

export type ExerciseSet = {
  id: string;
  exerciseCode: string;
  fields: Record<string, number | undefined>;
  rpe?: number;
  completed: boolean;
  bodyPartProfileId?: number;
};

export type Session = {
  id: string;
  date: string;
  sets: ExerciseSet[];
};

export type SessionState = {
  date: string;
  setsByExercise: Record<string, ExerciseSet[]>;
};
