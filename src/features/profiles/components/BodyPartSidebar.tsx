/**
 * Component for selecting Body Part Profiles in Dashboard and History views.
 * Fetches active body part profiles and renders them in a sidebar list.
 * Allows selecting a specific body part profile (including side).
 */

import { useEffect, useState } from "react";
import { getBodyPartProfiles } from "../api";
import type { BodyPartProfile } from "../types";

interface BodyPartSidebarProps {
  selectedProfileId: number | null;
  onSelectProfile: (profile: BodyPartProfile) => void;
}

function bodyPartLabel(profile: BodyPartProfile) {
  return `${profile.bodyPartName} (${profile.side})`;
}

export default function BodyPartSidebar({
  selectedProfileId,
  onSelectProfile,
}: BodyPartSidebarProps) {
  const [profiles, setProfiles] = useState<BodyPartProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfiles = async () => {
      try {
        const data = await getBodyPartProfiles(false);
        if (mounted) setProfiles(data);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfiles();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <aside className="w-64 border-r bg-background p-4">
      <h2 className="mb-4 text-lg font-semibold">Body Parts</h2>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}

      <ul className="space-y-1">
        {profiles.map((profile) => {
          const isSelected = selectedProfileId === profile.id;

          return (
            <li key={profile.id}>
              <button
                type="button"
                onClick={() => onSelectProfile(profile)}
                className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {bodyPartLabel(profile)}
              </button>
            </li>
          );
        })}

        {!loading && profiles.length === 0 && (
          <li className="text-sm text-muted-foreground">
            No body parts found
          </li>
        )}
      </ul>
    </aside>
  );
}
