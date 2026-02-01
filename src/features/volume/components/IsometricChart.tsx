/** Component for Isometric Chart. 
 * Wraps BaseDualAxisChart with isometric-specific labeling and configuration,
 * displaying volume (seconds) over time.
*/

import type { VolumeIntensityPoint } from "../types";
import BaseDualAxisChart from "./BaseDualAxisChart";

export default function IsometricChart({ data, aggregation }: {
  data: VolumeIntensityPoint[];
  aggregation: "daily" | "weekly" | "monthly";  
}) {
  return (
    <BaseDualAxisChart
      title="Isometric"
      data={data}
      volumeLabel="Seconds"
      aggregation={aggregation}
    />
  );
}
