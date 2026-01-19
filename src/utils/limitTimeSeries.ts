export function limitTimeSeries<T>(
  data: T[],
  maxPoints: number
): T[] {
  if (data.length <= maxPoints) return data;
  return data.slice(data.length - maxPoints);
}
