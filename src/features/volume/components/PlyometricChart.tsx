/** Component for Plyometric Chart. 
 * Wraps BaseDualAxisChart with plyometric-specific labeling and configuration,
 * displaying volume (Jump Count) over time.
*/

import type { VolumeIntensityPoint } from "../types";
import BaseDualAxisChart from "./BaseDualAxisChart";

export default function PlyometricChart({ data, aggregation }: {
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
