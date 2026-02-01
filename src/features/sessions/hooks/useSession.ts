/** Hook for session logging.
 *  Manage full workout session state (date, exercises, sets).
 *  Helpers to save state for exercises, sets, and set values.
 *  Enforce config-driven validation and completion rules.
 *  Persists in-progress sessions to localStorage.
 *  Submits completed sessions to the API.
 *  Resets session upon success.
 */

import { useEffect, useState } from "react";
import { createSession } from "../api";
import type { AppConfig } from "../../../types/appConfig";
import type { SessionState, ExerciseSet } from "../types";
import { sanitizeNumber, isSetFieldsComplete } from "../domain/sessionRules";

const STORAGE_KEY = "draft_session_v1";

export function useSession(config: AppConfig | null) {
  const todayLocal = new Date().toISOString().slice(0, 10);

  const [session, setSession] = useState<SessionState>({
    date: todayLocal,
    setsByExercise: {},
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const addExercise = (exerciseCode: string) => {
    setSession((prev) => {
      if (prev.setsByExercise[exerciseCode]) return prev;
      return {
        ...prev,
        setsByExercise: {
          ...prev.setsByExercise,
          [exerciseCode]: [],
        },
      };
    });
  };

  const removeExercise = (exerciseCode: string) => {
    setSession((prev) => {
      const next = { ...prev.setsByExercise };
      delete next[exerciseCode];
      return { ...prev, setsByExercise: next };
    });
  };

  const addSet = (exerciseCode: string) => {
    if (!config) return;

    const exercise = config.exercises[exerciseCode];
    const setTypeCode = config.setTypeByExerciseType[exercise.type];
    const setType = config.setTypes[setTypeCode];

    const newSet: ExerciseSet = {
      id: crypto.randomUUID(),
      exerciseCode,
      fields: Object.fromEntries(
        Object.keys(setType.fields).map((k) => [k, undefined])
      ),
      rpe: undefined,
      completed: false,
    };

    setSession((prev) => ({
      ...prev,
      setsByExercise: {
        ...prev.setsByExercise,
        [exerciseCode]: [...prev.setsByExercise[exerciseCode], newSet],
      },
    }));
  };

  const updateField = (
    exerciseCode: string,
    setId: string,
    field: string,
    value: number | undefined
  ) => {
    const safeValue = sanitizeNumber(value, { min: 0 });

    setSession((prev) => ({
      ...prev,
      setsByExercise: {
        ...prev.setsByExercise,
        [exerciseCode]: prev.setsByExercise[exerciseCode].map((s) =>
          s.id === setId
            ? { ...s, fields: { ...s.fields, [field]: safeValue } }
            : s
        ),
      },
    }));
  };

  const updateRpe = (
    exerciseCode: string,
    setId: string,
    value: number | undefined
  ) => {
    const safeValue = sanitizeNumber(value, { min: 1, max: 10 });

    setSession((prev) => ({
      ...prev,
      setsByExercise: {
        ...prev.setsByExercise,
        [exerciseCode]: prev.setsByExercise[exerciseCode].map((s) =>
          s.id === setId ? { ...s, rpe: safeValue } : s
        ),
      },
    }));
  };

  const toggleSetComplete = (
    exerciseCode: string,
    setId: string,
    completed: boolean
  ) => {
    setSession((prev) => ({
      ...prev,
      setsByExercise: {
        ...prev.setsByExercise,
        [exerciseCode]: prev.setsByExercise[exerciseCode].map((s) =>
          s.id === setId ? { ...s, completed } : s
        ),
      },
    }));
  };

  const removeSet = (exerciseCode: string, setId: string) => {
    setSession((prev) => ({
      ...prev,
      setsByExercise: {
        ...prev.setsByExercise,
        [exerciseCode]: prev.setsByExercise[exerciseCode].filter(
          (s) => s.id !== setId
        ),
      },
    }));
  };

  const isSetComplete = (exerciseCode: string, set: ExerciseSet) => {
    if (!config) return;

    const exercise = config.exercises[exerciseCode];
    const setTypeCode = config.setTypeByExerciseType[exercise.type];
    const completionRequires =
      config.setTypes[setTypeCode].completionRequires;

    return (
      isSetFieldsComplete(set, completionRequires) &&
      typeof set.rpe === "number" &&
      set.completed === true
    );
  };

  const canCompleteSession = () => {
    const allSets = Object.entries(session.setsByExercise).flatMap(
      ([exerciseCode, sets]) =>
        sets.map((set) => ({ exerciseCode, set }))
    );

    if (allSets.length === 0) return false;

    return allSets.every(({ exerciseCode, set }) =>
      isSetComplete(exerciseCode, set)
    );
  };

  const completeSession = async () => {
    if (!canCompleteSession()) return;

    const payload = {
      date: new Date(session.date + "T12:00:00").toISOString(),
      sets: Object.entries(session.setsByExercise).flatMap(
        ([exerciseCode, sets]) =>
          sets.map((set) => ({
            exercise_code: exerciseCode,
            ...set.fields,
            rpe: set.rpe!,
          }))
      ),
    };

    await createSession(payload);

    localStorage.removeItem(STORAGE_KEY);
    setSession({ date: todayLocal, setsByExercise: {} });
  };

  return {
    session,
    setSession,
    addExercise,
    removeExercise,
    addSet,
    updateField,
    updateRpe,
    toggleSetComplete,
    removeSet,
    canCompleteSession,
    completeSession,
  };
}
