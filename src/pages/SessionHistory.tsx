import { useEffect, useState } from "react";
import BodyPartSidebar from "../../src/features/profiles/components/BodyPartSidebar";
import { listSessions } from "../features/sessions/api";
import { loadAppConfig } from "../shared/config/loadConfig";
import type { AppConfig } from "../types/appConfig";
import type { Session } from "../features/sessions/types";

export default function SessionHistoryPage() {
  /* -------------------------
     App config
  --------------------------*/
  const [config, setConfig] = useState<AppConfig | null>(null);

  /* -------------------------
     Sidebar selection (BODY PART CODE)
  --------------------------*/
  const [selectedBodyPartCode, setSelectedBodyPartCode] =
    useState<string | null>(null);

  /* -------------------------
     Session data
  --------------------------*/
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------
     Load app config
  --------------------------*/
  useEffect(() => {
    loadAppConfig().then(setConfig);
  }, []);

  /* -------------------------
     Load sessions
  --------------------------*/
  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        const data = await listSessions();
        setSessions(data);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  if (!config) {
    return <div className="p-6">Loading config…</div>;
  }

  /* -------------------------
     Flatten sets + join to config
  --------------------------*/
  const allSets = sessions.flatMap((session) =>
    session.sets.map((set) => {
      const exercise = config.exercises[set.exerciseCode];
      const exerciseType = exercise?.type;
      const setTypeKey = exerciseType
        ? config.setTypeByExerciseType[exerciseType]
        : null;
      const setTypeConfig = setTypeKey
        ? config.setTypes[setTypeKey]
        : null;

      return {
        ...set,
        exerciseName: exercise?.name ?? set.exerciseCode,
        bodyParts: exercise?.bodyParts ?? [],
        sessionDate: session.date,
        setTypeConfig,
      };
    })
  );

  /* -------------------------
     Filter by selected body part
  --------------------------*/
  const filteredSets = allSets.filter((set) =>
    selectedBodyPartCode
      ? set.bodyParts.includes(selectedBodyPartCode)
      : true
  );

  const activeBodyPartLabel = selectedBodyPartCode
    ? config.bodyParts[selectedBodyPartCode]
    : "All Body Parts";


  /* -------------------------
     Render
  --------------------------*/
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <BodyPartSidebar
        selectedBodyPartCode={selectedBodyPartCode}
        onSelect={setSelectedBodyPartCode}
        includeAllOption
      />

      {/* Main */}
      <main className="flex-1 max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Session History</h1>

        <div className="mb-4 mt-1 text-sm text-muted-foreground">
          Showing:{" "}
          <span className="font-medium text-foreground">
            {activeBodyPartLabel}
          </span>
        </div>

        {loading && (
          <div className="text-sm text-muted-foreground">
            Loading sessions…
          </div>
        )}

        {!loading && filteredSets.length === 0 && (
          <div className="rounded border border-dashed p-4 text-sm text-muted-foreground">
            No sets found.
          </div>
        )}

        {!loading && filteredSets.length > 0 && (
          <div className="divide-y rounded border">
            {filteredSets.map((set) => (
              <div
                key={set.id}
                className="flex items-center gap-3 px-3 py-2 text-sm"
              >
                {/* Date */}
                <div className="w-16 shrink-0 text-xs text-muted-foreground">
                  {new Date(set.sessionDate).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>

                {/* Exercise */}
                <div className="w-32 shrink-0 font-medium truncate">
                  {set.exerciseName}
                </div>

                {/* Set fields */}
                <div className="flex gap-4">
                  {set.setTypeConfig &&
                    Object.keys(set.setTypeConfig.fields).sort((a, b) => {
                      if (a === "weight") return -1;
                      if (b === "weight") return 1;
                      return 0;
                    }).map((fieldKey) => {
                      const value = set.fields[fieldKey];
                      if (value == null) return null;

                      switch (fieldKey) {
                        case "reps":
                          return <span key={fieldKey}>{value} reps</span>;
                        case "weight":
                          return <span key={fieldKey}>{value} lb</span>;
                        case "durationSeconds":
                          return <span key={fieldKey}>{value}s</span>;
                        default:
                          return (
                            <span key={fieldKey}>
                              {fieldKey}: {value}
                            </span>
                          );
                      }
                    })}
                </div>

                {/* RPE */}
                {set.rpe != null && (
                  <div className="ml-auto text-xs text-muted-foreground">
                    RPE {set.rpe}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
