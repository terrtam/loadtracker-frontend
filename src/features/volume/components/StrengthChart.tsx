/** Component for Strength Chart. 
 * Wraps BaseDualAxisChart with strength-specific labeling and configuration,
 * displaying volume (weight × reps) over time.
*/

import type { VolumeIntensityPoint } from "../types";
import BaseDualAxisChart from "./BaseDualAxisChart";

export default function StrengthChart({ data, aggregation}: {
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
