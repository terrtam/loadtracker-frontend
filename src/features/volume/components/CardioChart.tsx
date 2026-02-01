/** Component for Cardio Chart. 
 *  Wraps BaseDualAxisChart with cardio-specific labeling and configuration,
 *  displaying volume (seconds) over time.
*/

import type { VolumeIntensityPoint } from "../types";
import BaseDualAxisChart from "./BaseDualAxisChart";

export default function CardioChart({ data, aggregation }: {
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
