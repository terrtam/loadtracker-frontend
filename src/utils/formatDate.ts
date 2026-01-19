export function formatChartDate(
  iso: string,
  aggregation: "daily" | "weekly" | "monthly"
) {
  let d: Date;

  if (aggregation === "monthly") {
    // iso = "YYYY-MM"
    const [year, month] = iso.split("-").map(Number);
    d = new Date(Date.UTC(year, month - 1, 1, 12)); // midday UTC
    return d.toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });
  }

  // iso = "YYYY-MM-DD"
  const [y, m, day] = iso.split("-").map(Number);
  d = new Date(Date.UTC(y, m - 1, day, 12)); // midday UTC

  if (aggregation === "weekly") {
    const weekStart = getISOWeekStartUTC(d);
    return weekStart.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  // daily
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function getISOWeekStartUTC(date: Date) {
  const d = new Date(date); // already UTC-safe
  const day = d.getUTCDay() || 7; // Sunday = 7
  d.setUTCDate(d.getUTCDate() - day + 1); // Monday
  return d;
}
