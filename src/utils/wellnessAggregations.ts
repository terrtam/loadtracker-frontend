import type { WellnessLog } from "../types/wellness";

export type ChartPoint = {
  date: string;
  value: number;
};

export type Aggregation = "daily" | "weekly" | "monthly";

/* --------------------------------
   Date key helpers
--------------------------------- */

function getDateKey(iso: string) {
  return iso.slice(0, 10); // YYYY-MM-DD
}

function getWeekKey(iso: string) {
  const d = new Date(iso);
  const day = (d.getUTCDay() + 6) % 7; // Monday start
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

function getMonthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/* --------------------------------
   Aggregator
--------------------------------- */

export function aggregateAvg(
  logs: WellnessLog[],
  field: "painScore" | "fatigueScore",
  aggregation: Aggregation = "daily"
): ChartPoint[] {
  const map = new Map<string, { total: number; count: number }>();

  for (const log of logs) {
    let key: string;

    switch (aggregation) {
      case "daily":
        key = getDateKey(log.loggedAt);
        break;
      case "weekly":
        key = getWeekKey(log.loggedAt);
        break;
      case "monthly":
        key = getMonthKey(log.loggedAt);
        break;
    }

    const value = log[field];
    const entry = map.get(key) ?? { total: 0, count: 0 };

    entry.total += value;
    entry.count += 1;

    map.set(key, entry);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      value: v.total / v.count,
    }));
}
