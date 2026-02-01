/* Page to Log Session.
   Loads app config containing exercises, set types and validation rules.
   Initialize workout session with useSession hook.
   Renders the session editor UI (exercise selection, sets, fields, RPE).
   Enforces config-driven completion rules for sets and sessions.
   Handles UI concerns such as loading state and success feedback.
*/

import { useEffect, useState } from "react";
import SidebarLayout from "../shared/layout/SidebarLayout";
import ExerciseSidebar from "../features/sessions/components/ExerciseSidebar";
import { loadAppConfig } from "../shared/config/loadConfig";
import { useSession } from "../features/sessions/hooks/useSession";
import type { AppConfig } from "../types/appConfig";

export default function Session() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAppConfig().then(setConfig);
  }, []);

  const sessionApi = useSession(config);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  if (!config) {
    return <div>Loading session…</div>;
  }

  const {session, setSession, addExercise, removeExercise, addSet, updateField, updateRpe, 
    toggleSetComplete, removeSet, canCompleteSession, completeSession} = sessionApi;

  const todayLocal = new Date().toISOString().slice(0, 10);
  const oneYearAgoLocal = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
  })();

  const handleCompleteSession = async () => {
    try {
      await completeSession();
      setSuccessMessage("Session saved");
    } catch {
      setSuccessMessage("Failed to save session");
    }
  };

  return (
    <SidebarLayout
      sidebar={
        <ExerciseSidebar
          config={config}
          onSelectExercise={addExercise}
        />
      }
    >
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Workout Session</h1>

        {successMessage && (
          <div className="mb-4 rounded bg-green-100 text-green-800 px-4 py-2">
            {successMessage}
          </div>
        )}

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
                  completionRequires.every(
                    (f) => typeof set.fields[f] === "number"
                  ) && typeof set.rpe === "number";

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
            onClick={handleCompleteSession}
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
