import api from "../,,/../../shared/api/client";
import type { BodyPartProfile } from "../../features/profiles/types";

/**
 * GET /api/body-part-profiles
 * Optional ?archived=true|false
 */
export async function getBodyPartProfiles(
  archived?: boolean
): Promise<BodyPartProfile[]> {
  const params =
    archived !== undefined ? { archived } : undefined;

  const res = await api.get<BodyPartProfile[]>(
    "/body-part-profiles",
    { params }
  );

  return res.data;
}

/**
 * POST /api/body-part-profiles
 */
export async function createBodyPartProfile(data: {
  bodyPartName: string;
  side: "left" | "right";
}): Promise<BodyPartProfile> {
  const res = await api.post<BodyPartProfile>(
    "/body-part-profiles",
    data
  );

  return res.data;
}

/**
 * PATCH /api/body-part-profiles/:id/archive
 */
export async function archiveProfile(id: number): Promise<void> {
  await api.patch(`/body-part-profiles/${id}/archive`);
}

/**
 * PATCH /api/body-part-profiles/:id/unarchive
 */
export async function unarchiveProfile(id: number): Promise<void> {
  await api.patch(`/body-part-profiles/${id}/unarchive`);
}
