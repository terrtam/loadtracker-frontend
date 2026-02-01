/** API client for workout sessions.
 *  Handles authentication, API DTOs, and mapping backend responses
 *  into frontend domain models.
 */

import type { Session, ExerciseSet } from "./types";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface ApiExerciseSet {
  id: string;
  exercise_code: string;
  reps?: number;
  weight?: number;
  duration?: number;
  rpe: number;
  body_part_profile_id: number;
}

interface ApiSession {
  id: string;
  date: string;
  sets: ApiExerciseSet[];
}

export async function createSession(sessionData: {
  date?: string;
  sets: {
    exercise_code: string;
    reps?: number;
    weight?: number;
    durationSeconds?: number;
    rpe: number;
  }[];
}): Promise<Session> {
  const res = await axios.post(`${baseUrl}/api/sessions`, sessionData, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  return res.data;
}

export interface ListSessionsInput {
  bodyPartProfileId?: number;
}

export async function listSessions(
  params?: ListSessionsInput
): Promise<Session[]> {
  const res = await axios.get<ApiSession[]>(`${baseUrl}/api/sessions`, {
    headers: getAuthHeader(),
    params,
  });

  return res.data.map((session) => ({
    id: session.id,
    date: session.date,
    sets: session.sets.map<ExerciseSet>((set) => ({
      id: set.id,
      exerciseCode: set.exercise_code,
      fields: {
        reps: set.reps,
        weight: set.weight,
        durationSeconds: set.duration,
      },
      rpe: set.rpe,
      completed: true,
      bodyPartProfileId: set.body_part_profile_id,
    })),
  }));
}
