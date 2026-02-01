/**
 * Page displaying Session History of workout sets.
 * loadAppConfig() loads app configuration (exercises, set types, body parts).
 * listSessions() loads session history.
 * Flatten sessions into individual sets with exercise name, body parts,
 * session date, and set type config.
 * Filter sets by selected body part from BodyPartSidebar
 * Render date, exercise name, set fields and RPE.
 */

import { useEffect, useState } from "react";
import BodyPartSidebar from "../features/profiles/components/BodyPartSidebar";
import { listSessions } from "../features/sessions/api";
import { loadAppConfig } from "../shared/config/loadConfig";
import type { AppConfig } from "../types/appConfig";
import type { Session } from "../features/sessions/types";
import type { BodyPartProfile } from "../features/profiles/types";

export default function SessionHistoryPage() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedProfile, setSelectedProfile] =
    useState<BodyPartProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppConfig().then(setConfig);
  }, []);

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
        sessionDate: session.date,
        setTypeConfig,
      };
    })
  );

  const filteredSets = selectedProfile
    ? allSets.filter(
        (set) => set.bodyPartProfileId === selectedProfile.id
      )
    : allSets;

  return (
    <div className="flex h-full">
      <BodyPartSidebar
        selectedProfileId={selectedProfile?.id ?? null}
        onSelectProfile={setSelectedProfile}
      />

      <main className="flex-1 max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Session History</h1>

        <div className="mb-4 mt-1 text-sm text-muted-foreground">
          Showing:{" "}
          <span className="font-medium text-foreground">
            {selectedProfile
              ? `${selectedProfile.bodyPartName} (${selectedProfile.side})`
              : "All Body Parts"}
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
                <div className="w-16 shrink-0 text-xs text-muted-foreground">
                  {new Date(set.sessionDate).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>

                <div className="w-32 shrink-0 font-medium truncate">
                  {set.exerciseName}
                </div>

                <div className="flex gap-4">
                  {set.setTypeConfig &&
                    Object.keys(set.setTypeConfig.fields)
                      .sort((a, b) => {
                        if (a === "weight") return -1;
                        if (b === "weight") return 1;
                        return 0;
                      })
                      .map((fieldKey) => {
                        const value = set.fields[fieldKey];
                        if (value == null) return null;

                        switch (fieldKey) {
                          case "reps":
                            return (
                              <span key={fieldKey}>{value} reps</span>
                            );
                          case "weight":
                            return (
                              <span key={fieldKey}>{value} lb</span>
                            );
                          case "durationSeconds":
                            return (
                              <span key={fieldKey}>{value}s</span>
                            );
                          default:
                            return (
                              <span key={fieldKey}>
                                {fieldKey}: {value}
                              </span>
                            );
                        }
                      })}
                </div>

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
