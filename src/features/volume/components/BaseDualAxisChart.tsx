// src/components/volume/BaseDualAxisChart.tsx
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { VolumeIntensityPoint } from "../types";

import { formatNumber } from "../../../shared/utils/number";
import { formatChartDate } from "../../../shared/utils/date";

type Props = {
  title: string;
  data: VolumeIntensityPoint[];
  volumeLabel: string;
  aggregation: "daily" | "weekly" | "monthly";
};

export default function BaseDualAxisChart({
  title,
  data,
  volumeLabel,
  aggregation,
}: Props) {
  return (
    <div className="border rounded p-3">
      <h3 className="font-medium mb-2">{title}</h3>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) =>
              formatChartDate(date, aggregation)
            }
          />

          <YAxis
            yAxisId="left"
            label={{
              value: volumeLabel,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 10]}
            label={{
              value: "RPE",
              angle: 90,
              position: "insideRight",
              style: { textAnchor: "middle" },
            }}
          />

          <Tooltip
            formatter={(value: number) => formatNumber(value)}
            labelFormatter={(label) =>
              formatChartDate(label, aggregation)
            }
          />

          <Bar
            yAxisId="left"
            dataKey="volume"
            fillOpacity={0.4}
          />

          <Line
            yAxisId="right"
            dataKey="intensity"
            strokeWidth={2}
            dot={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
