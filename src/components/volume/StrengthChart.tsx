// src/components/volume/StrengthChart.tsx
import type { VolumeIntensityPoint } from "../../types/volume";
import BaseDualAxisChart from "./BaseDualAxisChart";

export default function StrengthChart({
  data,
  aggregation
}: {
  data: VolumeIntensityPoint[];
  aggregation: "daily" | "weekly" | "monthly";  
}) {
  return (
    <BaseDualAxisChart
      title="Strength"
      data={data}
      volumeLabel="Weight × Reps"
      aggregation={aggregation}
    />
  );
}
