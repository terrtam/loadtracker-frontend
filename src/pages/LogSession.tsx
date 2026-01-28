import { useEffect, useState } from "react";
import { loadAppConfig } from "../shared/config/loadConfig";
import type { AppConfig } from "../types/appConfig";
import type { SessionState, ExerciseSet } from "../features/sessions/types";
import ExerciseSidebar from "../features/sessions/components/ExerciseSidebar";
import { createSession } from "../features/sessions/api";
import SidebarLayout from "../shared/layout/SidebarLayout";

const STORAGE_KEY = "draft_session_v1";

export default function Session() {
  const [config, setConfig] = useState<AppConfig | null>(null);

  const todayLocal = new Date().toISOString().slice(0, 10);
  const oneYearAgoLocal = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
  })();
  const [session, setSession] = useState<SessionState>({
    date: todayLocal,
    setsByExercise: {},
  });


  /* -------------------------
     Load app config
  --------------------------*/
  useEffect(() => {
    loadAppConfig().then(setConfig);
  }, []);

  /* -------------------------
     Autosave session
  --------------------------*/
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  if (!config) return <div>Loading session…</div>;

  /* -------------------------
     Exercise / Set Mutations
  --------------------------*/

  const addExerciseToSession = (exerciseCode: string) => {
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

  const sanitizeNumber = (
    value: number | undefined,
    { min = 0, max }: { min?: number; max?: number } = {}
  ) => {
    if (typeof value !== "number" || Number.isNaN(value)) return undefined;

    let v = value;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);

    return v;
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

  /* -------------------------
     Completion Logic
  --------------------------*/

  const isSetFieldsComplete = (
    set: ExerciseSet,
    completionRequires: string[]
  ) =>
    completionRequires.every(
      (field) => typeof set.fields[field] === "number"
    );

  const getIncompleteSets = () => {
    const incomplete: string[] = [];

    Object.entries(session.setsByExercise).forEach(([exerciseCode, sets]) => {
      const exercise = config.exercises[exerciseCode];
      const setTypeCode = config.setTypeByExerciseType[exercise.type];
      const completionRequires =
        config.setTypes[setTypeCode].completionRequires;

      sets.forEach((set) => {
        if (
          !isSetFieldsComplete(set, completionRequires) ||
          typeof set.rpe !== "number" ||
          set.completed !== true
        ) {
          incomplete.push(set.id);
        }
      });
    });

    return incomplete;
  };

  const canCompleteSession = () => {
    const allSets = Object.values(session.setsByExercise).flat();
    if (allSets.length === 0) return false;
    return getIncompleteSets().length === 0;
  };

  /* -------------------------
     Submit Session
  --------------------------*/

  const completeSession = async () => {
    if (!canCompleteSession()) return;

    const payload = {
      date: new Date(session.date + "T12:00:00").toISOString(),
      sets: Object.entries(session.setsByExercise).flatMap(
        ([exerciseCode, sets]) =>
          sets.map((set) => {
            if (typeof set.rpe !== "number") {
              throw new Error("Invariant violated: RPE missing");
            }

            return {
              exercise_code: exerciseCode,
              ...set.fields,
              rpe: set.rpe,
            };
          })
      ),
    };

    try {
      const savedSession = await createSession(payload);

      console.log("Saved session:", savedSession);

      localStorage.removeItem(STORAGE_KEY);
      setSession({ date: todayLocal, setsByExercise: {} });

      alert("Session saved!");
    } catch (err) {
      console.error("Failed to save session", err);
      alert("Failed to save session");
    }
  };

  /* -------------------------
     Render
  --------------------------*/
  return (
    <SidebarLayout
      sidebar={
        <ExerciseSidebar
          config={config}
          onSelectExercise={addExerciseToSession}
        />
      }
    >
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Workout Session</h1>
        <div className="mb-6">
          <input
            type="date"
            value={session.date}
            min={oneYearAgoLocal}
            max={todayLocal}
            onChange={(e) =>
              setSession((prev) => ({
                ...prev,
                date: e.target.value,
              }))
            }
            className="border px-2 py-1 rounded"
          />
        </div>

        {Object.entries(session.setsByExercise).map(([code, sets]) => {
          const exercise = config.exercises[code];
          const setTypeCode =
            config.setTypeByExerciseType[exercise.type];
          const fields = config.setTypes[setTypeCode].fields;
          const completionRequires =
            config.setTypes[setTypeCode].completionRequires;

          return (
            <div key={code} className="mb-6 border-b pb-4">
              <h2 className="font-semibold text-lg flex justify-between">
                {exercise.name}
                {sets.length === 0 && (
                  <button
                    onClick={() => removeExercise(code)}
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                )}
              </h2>

              {sets.map((set, index) => {
                const canComplete =
                  isSetFieldsComplete(set, completionRequires) &&
                  typeof set.rpe === "number";

                return (
                  <div
                    key={set.id}
                    className={`flex gap-2 mt-2 items-center rounded px-2 py-1 ${
                      set.completed ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <span className="w-12 text-sm">
                      Set {index + 1}
                    </span>

                    {Object.keys(fields).map((field) => (
                      <input
                        key={field}
                        type="number"
                        min={0}
                        step="any"
                        disabled={set.completed}
                        className="border px-2 py-1 w-24"
                        placeholder={field}
                        value={set.fields[field] ?? ""}
                        onChange={(e) =>
                          updateField(
                            code,
                            set.id,
                            field,
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                    ))}

                    <input
                      type="number"
                      min={1}
                      max={10}
                      step={0.5}
                      disabled={set.completed}
                      className="border px-2 py-1 w-20"
                      placeholder="RPE"
                      value={set.rpe ?? ""}
                      onChange={(e) =>
                        updateRpe(
                          code,
                          set.id,
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                    />

                    {!set.completed ? (
                      <button
                        disabled={!canComplete}
                        onClick={() =>
                          toggleSetComplete(code, set.id, true)
                        }
                        className={`font-bold ${
                          canComplete
                            ? "text-green-600"
                            : "text-gray-300"
                        }`}
                      >
                        ✓
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          toggleSetComplete(code, set.id, false)
                        }
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => removeSet(code, set.id)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              <button
                onClick={() => addSet(code)}
                className="mt-3 text-sm text-blue-600"
              >
                + Add Set
              </button>
            </div>
          );
        })}

        <div className="mt-8">
          {!canCompleteSession() && (
            <div className="text-sm text-red-600 mb-2">
              Add at least one completed set (with RPE) to finish the
              session.
            </div>
          )}

          <button
            disabled={!canCompleteSession()}
            onClick={completeSession}
            className={`px-4 py-2 rounded text-white ${
              canCompleteSession()
                ? "bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Complete Session
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
}
