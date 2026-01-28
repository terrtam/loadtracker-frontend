import axios from "axios";
import type { WellnessLog } from "../wellness/types";

const baseUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* =====================================================
   Backend (snake_case) response types
===================================================== */

type BackendBodyPartProfile = {
  id: number;
  bodyPartName: string;
  side: "left" | "right";
  archived: boolean;
};

type BackendWellnessLog = {
  id: number;
  logged_at: string;
  pain_score: number;
  fatigue_score: number;
  bodyPartProfile: BackendBodyPartProfile;
};

/* =====================================================
   Create
===================================================== */

export interface CreateWellnessLogInput {
  bodyPartProfileId: number;
  painScore: number;
  fatigueScore: number;
  loggedAt?: string;
}

export const createWellnessLog = async (
  data: CreateWellnessLogInput
) => {
  const response = await axios.post(
    `${baseUrl}/api/wellness`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    }
  );

  return response.data;
};

/* =====================================================
   List
===================================================== */

export interface ListWellnessLogsInput {
  bodyPartProfileId?: number;
  from?: string;
  to?: string;
  limit?: number;
}

export const listWellnessLogs = async (
  params?: ListWellnessLogsInput
): Promise<WellnessLog[]> => {
  const response = await axios.get<BackendWellnessLog[]>(
    `${baseUrl}/api/wellness`,
    {
      headers: getAuthHeader(),
      params,
    }
  );

  // 🔁 Normalize snake_case → camelCase
  return response.data.map((log) => ({
    id: log.id,
    loggedAt: log.logged_at,
    painScore: log.pain_score,
    fatigueScore: log.fatigue_score,
    bodyPartProfile: {
      id: log.bodyPartProfile.id,
      bodyPartName: log.bodyPartProfile.bodyPartName,
      side: log.bodyPartProfile.side,
      archived: log.bodyPartProfile.archived,
    },
  }));
};

/* =====================================================
   Wellness Analytics
===================================================== */

export interface WellnessSeriesPoint {
  date: string;
  avg: number;
}

export interface WellnessSeriesParams {
  start: string;
  end: string;
  aggregation?: "daily" | "weekly";
  bodyPartNames?: string[];
}

const serializeSeriesParams = (params: WellnessSeriesParams) => ({
  ...params,
  bodyPartNames: params.bodyPartNames?.join(","),
});

export const getWellnessPainSeries = async (
  params: WellnessSeriesParams
): Promise<WellnessSeriesPoint[]> => {
  const response = await axios.get<WellnessSeriesPoint[]>(
    `${baseUrl}/api/wellness/pain/series`,
    {
      headers: getAuthHeader(),
      params: serializeSeriesParams(params),
    }
  );

  return response.data;
};

export const getWellnessFatigueSeries = async (
  params: WellnessSeriesParams
): Promise<WellnessSeriesPoint[]> => {
  const response = await axios.get<WellnessSeriesPoint[]>(
    `${baseUrl}/api/wellness/fatigue/series`,
    {
      headers: getAuthHeader(),
      params: serializeSeriesParams(params),
    }
  );

  return response.data;
};
