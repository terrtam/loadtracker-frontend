// src/components/volume/PlyometricChart.tsx
import type { VolumeIntensityPoint } from "../types";
import BaseDualAxisChart from "./BaseDualAxisChart";

export default function PlyometricChart({
  data,
  aggregation
}: {
  data: VolumeIntensityPoint[];
  aggregation: "daily" | "weekly" | "monthly";  
}) {
  return (
    <BaseDualAxisChart
      title="Plyometric"
      data={data}
      volumeLabel="Jump Count"
      aggregation={aggregation}
    />
  );
}
