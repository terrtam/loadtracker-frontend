/** API for Body Part Profiles.
 * Provides typed wrappers around `/body-part-profiles` endpoints,
 * including listing, creation, archiving, and unarchiving.
 */

import api from "../,,/../../shared/api/client";
import type { BodyPartProfile } from "../../features/profiles/types";

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

export async function archiveProfile(id: number): Promise<void> {
  await api.patch(`/body-part-profiles/${id}/archive`);
}

export async function unarchiveProfile(id: number): Promise<void> {
  await api.patch(`/body-part-profiles/${id}/unarchive`);
}
