import { useEffect, useMemo, useState } from "react";
import type { BodyPartProfile } from "../../../features/profiles/types";
import type { Session } from "../../../features/sessions/types";
import { listSessions } from "../../../features/sessions/api";

import StrengthChart from "./StrengthChart";
import PlyometricChart from "./PlyometricChart";
import IsometricChart from "./IsometricChart";
import CardioChart from "./CardioChart";

import {
  aggregateStrength,
  aggregatePlyometric,
  aggregateIsometric,
  aggregateCardio,
} from "../utils";

import { limitTimeSeries } from "../../../shared/utils/timeSeries";

type Props = {
  profile: BodyPartProfile | null;
  aggregation: "daily" | "weekly" | "monthly";
};

const MAX_POINTS: Record<"daily" | "weekly" | "monthly", number> = {
  daily: 28,
  weekly: 12,
  monthly: 12,
};

export default function VolumeCharts({ profile, aggregation }: Props) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await listSessions();
        if (!cancelled) setSessions(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const maxPoints = MAX_POINTS[aggregation];

  const strength = useMemo(
    () =>
      profile
        ? limitTimeSeries(
            aggregateStrength(sessions, profile, aggregation),
            maxPoints
          )
        : [],
    [sessions, profile, aggregation, maxPoints]
  );

  const plyometric = useMemo(
    () =>
      profile
        ? limitTimeSeries(
            aggregatePlyometric(sessions, profile, aggregation),
            maxPoints
          )
        : [],
    [sessions, profile, aggregation, maxPoints]
  );

  const isometric = useMemo(
    () =>
      profile
        ? limitTimeSeries(
            aggregateIsometric(sessions, profile, aggregation),
            maxPoints
          )
        : [],
    [sessions, profile, aggregation, maxPoints]
  );

  const cardio = useMemo(
    () =>
      profile
        ? limitTimeSeries(
            aggregateCardio(sessions, profile, aggregation),
            maxPoints
          )
        : [],
    [sessions, profile, aggregation, maxPoints]
  );

  if (!profile) {
    return (
      <div className="text-muted-foreground">
        Select a body part profile to view analytics
      </div>
    );
  }

  if (loading) {
    return <div>Loading training load…</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Training Load (Volume & Intensity)
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <StrengthChart data={strength} aggregation={aggregation}/>
        <PlyometricChart data={plyometric} aggregation={aggregation}/>
        <IsometricChart data={isometric} aggregation={aggregation}/>
        <CardioChart data={cardio} aggregation={aggregation}/>
      </div>
    </div>
  );
}
