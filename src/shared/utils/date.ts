/** Formats dates based on daily/weekly/monthly aggregation type. 
 *  Converts ISO strings from backend into clean chart labels.
 *  getISOWeekStartUTC() finds start of week.
*/

export function formatChartDate(
  iso: string,
  aggregation: "daily" | "weekly" | "monthly"
) {
  let d: Date;

  if (aggregation === "monthly") {
    const [year, month] = iso.split("-").map(Number);
    d = new Date(Date.UTC(year, month - 1, 1, 12)); // midday UTC
    return d.toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });
  }

  const [y, m, day] = iso.split("-").map(Number);
  d = new Date(Date.UTC(y, m - 1, day, 12));

  if (aggregation === "weekly") {
    const weekStart = getISOWeekStartUTC(d);
    return weekStart.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function getISOWeekStartUTC(date: Date) {
  const d = new Date(date); 
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - day + 1);
  return d;
}
