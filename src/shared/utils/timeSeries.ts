/**
 * Trims a time-series array to a maximum number of points by
 * removing the oldest entries and keeping the most recent ones.
 */

export function limitTimeSeries<T>(data: T[], maxPoints: number): T[] {
  if (data.length <= maxPoints) return data;
  return data.slice(data.length - maxPoints);
}
