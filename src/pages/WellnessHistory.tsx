import { useEffect, useState } from "react";
import BodyPartSidebar from "../features/profiles/components/BodyPartSidebar";
import { listWellnessLogs } from "../features/wellness/api";
import type { WellnessLog } from "../features/wellness/types";
import type { BodyPartProfile } from "../features/profiles/types";

export default function WellnessHistoryPage() {
  const [selectedProfile, setSelectedProfile] =
    useState<BodyPartProfile | null>(null);
  const [logs, setLogs] = useState<WellnessLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const data = await listWellnessLogs();
        setLogs(data);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const filteredLogs = selectedProfile
    ? logs.filter(
        (log) =>
          log.bodyPartProfile.id === selectedProfile.id
      )
    : logs;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <BodyPartSidebar
        selectedProfileId={selectedProfile?.id ?? null}
        onSelectProfile={setSelectedProfile}
      />

      {/* Main */}
      <main className="flex-1 max-w-3xl p-4">
        <h1 className="mb-1 text-xl font-semibold">
          Wellness History
        </h1>

        <div className="mb-4 text-sm text-muted-foreground">
          Showing:{" "}
          <span className="font-medium text-foreground">
            {selectedProfile
              ? `${selectedProfile.bodyPartName} (${selectedProfile.side})`
              : "All Body Parts"}
          </span>
        </div>

        {loading && (
          <div className="text-sm text-muted-foreground">
            Loading wellness history…
          </div>
        )}

        {!loading && filteredLogs.length === 0 && (
          <div className="rounded border border-dashed p-3 text-sm text-muted-foreground">
            No wellness entries found.
          </div>
        )}

        {!loading && filteredLogs.length > 0 && (
          <div className="divide-y rounded border">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">
                    {new Date(log.loggedAt).toLocaleDateString()}
                  </div>

                  <div className="font-medium">
                    {log.bodyPartProfile.bodyPartName}
                    <span className="ml-1 capitalize text-muted-foreground">
                      ({log.bodyPartProfile.side})
                    </span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex gap-4 text-muted-foreground">
                  <div>Pain {log.painScore}</div>
                  <div>Fatigue {log.fatigueScore}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}