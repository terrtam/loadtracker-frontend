import type { AppConfig } from "../types/appConfig";

export async function loadAppConfig(): Promise<AppConfig> {
  const res = await fetch("/config/app-config.json");
  if (!res.ok) {
    throw new Error("Failed to load app config");
  }
  return res.json();
}
