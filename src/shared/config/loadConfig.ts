/**
 * Loads App Config from app-config.json.
 * Config defines exercises, body parts, set types, and mappings
 * that drive form rendering, validation, and analytics logic.
 */

import type { AppConfig } from "../../types/appConfig";

export async function loadAppConfig(): Promise<AppConfig> {
  const res = await fetch("/config/app-config.json");
  if (!res.ok) {
    throw new Error("Failed to load app config");
  }
  return res.json();
}
