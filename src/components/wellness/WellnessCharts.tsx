import { useEffect, useMemo, useState } from "react";
import type { BodyPartProfile } from "../../types/bodyPartProfile";
import type { WellnessLog } from "../../types/wellness";
import { listWellnessLogs } from "../../api/wellness";

import PainChart from "./PainChart";
import FatigueChart from "./FatigueChart";
import { aggregateAvg } from "../../utils/wellnessAggregations";
import { limitTimeSeries } from "../../utils/limitTimeSeries";

type Props = {
  profiles: BodyPartProfile[];
  aggregation: "daily" | "weekly" | "monthly";
};

const MAX_POINTS: Record<"daily" | "weekly" | "monthly", number> = {
  daily: 28,
  weekly: 12,
  monthly: 12,
};

export default function WellnessCharts({ profiles, aggregation }: Props) {
  const profile = profiles[0] ?? null;

  const [logs, setLogs] = useState<WellnessLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) {
      setLogs([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await listWellnessLogs({
          bodyPartProfileId: profile.id,
        });

        if (!cancelled) {
          setLogs(data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [profile]);

  const maxPoints = MAX_POINTS[aggregation];

  const painData = useMemo(
    () =>
      limitTimeSeries(
        aggregateAvg(logs, "painScore", aggregation),
        maxPoints
      ),
    [logs, aggregation, maxPoints]
  );

  const fatigueData = useMemo(
    () =>
      limitTimeSeries(
        aggregateAvg(logs, "fatigueScore", aggregation),
        maxPoints
      ),
    [logs, aggregation, maxPoints]
  );

  if (!profile) {
    return null;
  }

  if (loading) {
    return <div className="p-6">Loading wellness…</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Wellness</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h3 className="font-medium mb-2">Pain</h3>
          <PainChart data={painData} aggregation={aggregation} />
        </section>

        <section>
          <h3 className="font-medium mb-2">Fatigue</h3>
          <FatigueChart data={fatigueData} aggregation={aggregation} />
        </section>
      </div>
    </div>
  );
}
