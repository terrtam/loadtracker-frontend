/** Manages Dashboard Aggregation States.
 *  Exports setters for daily/weekly/monthly views.
 */

import { useState } from "react";

export type Aggregation = "daily" | "weekly" | "monthly";

export function useDashboardAggregation(
  initial: Aggregation = "daily"
) {
  const [aggregation, setAggregation] = useState<Aggregation>(initial);

  return {
    aggregation,
    setDaily: () => setAggregation("daily"),
    setWeekly: () => setAggregation("weekly"),
    setMonthly: () => setAggregation("monthly"),
  };
}
