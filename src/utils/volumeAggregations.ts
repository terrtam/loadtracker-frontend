import type { Session, ExerciseSet } from "../types/session";
import type { BodyPartProfile } from "../types/bodyPartProfile";
import type { VolumeIntensityPoint } from "../types/volume";

import appConfig from "../../public/config/app-config.json";

/* -------------------------------------------------
   Helpers
-------------------------------------------------- */

function getExerciseMeta(exerciseCode: string) {
  return appConfig.exercises[exerciseCode as keyof typeof appConfig.exercises];
}

function exerciseMatchesProfile(
  set: ExerciseSet,
  profile: BodyPartProfile
): boolean {
  const meta = getExerciseMeta(set.exerciseCode);
  if (!meta) return false;

  return meta.bodyParts.includes(profile.bodyPartName);
}

function getDateKey(iso: string) {
  return iso.slice(0, 10); // YYYY-MM-DD
}

function getWeekKey(iso: string) {
  const d = new Date(iso);
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

function getMonthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  // e.g. 2026-01
}

type Accumulator = {
  volume: number;
  weightedRpe: number;
};




/* -------------------------------------------------
   Core aggregator factory
-------------------------------------------------- */

function aggregateByCategory(
  sessions: Session[],
  profile: BodyPartProfile,
  category: "strength" | "plyometric" | "isometric" | "cardio",
  volumeFn: (set: ExerciseSet) => number,
  aggregation: "daily" | "weekly" | "monthly"
): VolumeIntensityPoint[] {
  const map = new Map<string, Accumulator>();

  for (const session of sessions) {
    let date: string;

    switch (aggregation) {
      case "daily":
        date = getDateKey(session.date);
        break;
      case "weekly":
        date = getWeekKey(session.date);
        break;
      case "monthly":
        date = getMonthKey(session.date);
        break;
    }

    for (const set of session.sets) {
      const meta = getExerciseMeta(set.exerciseCode);
      if (!meta) continue;
      if (meta.type !== category) continue;
      if (!exerciseMatchesProfile(set, profile)) continue;

      const volume = volumeFn(set);
      if (volume <= 0) continue;

      const entry = map.get(date) ?? { volume: 0, weightedRpe: 0 };

      entry.volume += volume;

      if (set.rpe != null) {
        entry.weightedRpe += volume * set.rpe;
      }

      map.set(date, entry);
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date,
      volume: v.volume,
      intensity: v.volume > 0 ? v.weightedRpe / v.volume : null,
    }));
}

/* -------------------------------------------------
   CATEGORY EXPORTS
-------------------------------------------------- */

/**
 * Strength
 * Volume = Σ(weight × reps)
 */
export function aggregateStrength(
  sessions: Session[],
  profile: BodyPartProfile,
  aggregation: "daily" | "weekly" | "monthly"
): VolumeIntensityPoint[] {
  return aggregateByCategory(
    sessions,
    profile,
    "strength",
    (set) =>
      (set.fields.weight ?? 0) * (set.fields.reps ?? 0),
    aggregation
  );
}

/**
 * Plyometric
 * Volume = Σ(jump count)
 */
export function aggregatePlyometric(
  sessions: Session[],
  profile: BodyPartProfile,
  aggregation: "daily" | "weekly" | "monthly"
): VolumeIntensityPoint[] {
  return aggregateByCategory(
    sessions,
    profile,
    "plyometric",
    (set) => set.fields.reps ?? 0,
    aggregation
  );
}

/**
 * Isometric
 * Volume = Σ(duration_seconds)
 */
export function aggregateIsometric(
  sessions: Session[],
  profile: BodyPartProfile,
  aggregation: "daily" | "weekly" | "monthly"
): VolumeIntensityPoint[] {
  return aggregateByCategory(
    sessions,
    profile,
    "isometric",
    (set) => set.fields.durationSeconds ?? 0,
    aggregation
  );
}

/**
 * Cardio
 * Volume = Σ(duration_seconds)
 */
export function aggregateCardio(
  sessions: Session[],
  profile: BodyPartProfile,
  aggregation: "daily" | "weekly" | "monthly"
): VolumeIntensityPoint[] {
  return aggregateByCategory(
    sessions,
    profile,
    "cardio",
    (set) => set.fields.durationSeconds ?? 0,
    aggregation
  );
}
