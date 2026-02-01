/** Defines a Wellness Log. */

import type { BodyPartProfile } from "../profiles/types";

export interface WellnessLog {
  id: number;
  loggedAt: string;
  painScore: number;
  fatigueScore: number;
  bodyPartProfile: BodyPartProfile;
}
