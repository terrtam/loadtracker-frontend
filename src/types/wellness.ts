// src/types/wellness.ts
import type { BodyPartProfile } from "./bodyPartProfile";

export interface WellnessLog {
  id: number;
  loggedAt: string;
  painScore: number;
  fatigueScore: number;
  bodyPartProfile: BodyPartProfile;
}
