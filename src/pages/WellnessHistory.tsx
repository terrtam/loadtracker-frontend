import { useEffect, useState } from "react";
import BodyPartSidebar from "../components/BodyPartSidebar";
import { listWellnessLogs } from "../api/wellness";
import type { WellnessLog } from "../types/wellness";

export default function WellnessHistoryPage() {
  /* -------------------------
     Sidebar selection (CODE, not ID)
  --------------------------*/
  const [selectedBodyPartCode, setSelectedBodyPartCode] =
    useState<string | null>(null);

  /* -------------------------
     Wellness history
  --------------------------*/
  const [logs, setLogs] = useState<WellnessLog[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------
     Load wellness history
  --------------------------*/
  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);

      const data = await listWellnessLogs();

      setLogs(data);
      setLoading(false);
    };

    loadLogs();
  }, [selectedBodyPartCode]);

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
      <main className="flex-1 max-w-3xl p-4">
        <h1 className="mb-4 text-xl font-semibold">
          Wellness History
        </h1>

        {loading && (
          <div className="text-sm text-muted-foreground">
            Loading wellness history…
          </div>
        )}

        {!loading && logs.length === 0 && (
          <div className="rounded border border-dashed p-3 text-sm text-muted-foreground">
            No wellness entries found.
          </div>
        )}

        {!loading && logs.length > 0 && (
          <div className="divide-y rounded border">
            {logs.map((log) => (
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
