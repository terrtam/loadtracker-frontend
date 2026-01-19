// src/components/volume/CardioChart.tsx
import type { VolumeIntensityPoint } from "../../types/volume";
import BaseDualAxisChart from "./BaseDualAxisChart";

export default function CardioChart({
  data,
  aggregation
}: {
  data: VolumeIntensityPoint[];
  aggregation: "daily" | "weekly" | "monthly";  
}) {
  return (
    <BaseDualAxisChart
      title="Cardio"
      data={data}
      volumeLabel="Seconds"
      aggregation={aggregation}
    />
  );
}
