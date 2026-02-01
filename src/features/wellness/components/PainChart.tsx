/**
 * Component for Pain Chart.
 * Renders aggregated wellness data (daily / weekly / monthly)
 * with formatted dates and a fixed 0–10 pain scale.
 */

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { ChartPoint } from "../../../features/wellness/utils";
import { formatNumber } from "../../../shared/utils/number";
import { formatChartDate } from "../../../shared/utils/date";

type Props = {
  data: ChartPoint[];
  aggregation: "daily" | "weekly" | "monthly";
};

export default function PainChart({ data, aggregation }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(date) =>
            formatChartDate(date, aggregation)
          }
        />

        <YAxis
          domain={[0, 10]}
          label={{
            value: "Pain Score",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />

        <Tooltip
          formatter={(value: number) => formatNumber(value)}
          labelFormatter={(label) =>
            formatChartDate(label, aggregation)
          }
        />

        <Line type="monotone" dataKey="value" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
