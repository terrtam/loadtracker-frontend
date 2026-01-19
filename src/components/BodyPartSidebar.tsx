import { useEffect, useMemo, useState } from "react";
import { getBodyPartProfiles } from "../api/bodyPartProfiles";
import type { BodyPartProfile } from "../types/bodyPartProfile";

interface BodyPartSidebarProps {
  /** Used by history pages */
  selectedBodyPartCode: string | null;
  onSelect?: (bodyPartCode: string | null) => void;

  /** Used by wellness logging */
  onSelectProfile?: (profile: BodyPartProfile) => void;

  includeAllOption?: boolean;
  combineSides?: boolean;
}

function bodyPartLabel(profile: BodyPartProfile) {
  return `${profile.bodyPartName} (${profile.side})`;
}

export default function BodyPartSidebar({
  selectedBodyPartCode,
  onSelect,
  onSelectProfile,
  includeAllOption = false,
  combineSides = false,
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

  /**
   * When combineSides=true:
   * - Group profiles by bodyPartName
   * - One sidebar entry per body part
   */
  const sidebarItems = useMemo(() => {
    if (!combineSides) return profiles;

    const map = new Map<string, BodyPartProfile>();

    for (const profile of profiles) {
      const key = profile.bodyPartName.toLowerCase();
      if (!map.has(key)) {
        map.set(key, profile);
      }
    }

    return Array.from(map.values());
  }, [profiles, combineSides]);

  return (
    <aside className="w-64 border-r bg-background p-4">
      <h2 className="mb-4 text-lg font-semibold">Body Parts</h2>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}

      <ul className="space-y-1">
        {includeAllOption && onSelect && (
          <li>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                selectedBodyPartCode === null
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              All Body Parts
            </button>
          </li>
        )}

        {sidebarItems.map((profile) => {
          const bodyPartCode = profile.bodyPartName.toLowerCase();

          const isSelected =
            selectedBodyPartCode === bodyPartCode;

          return (
            <li key={profile.id}>
              <button
                type="button"
                onClick={() => {
                  if (onSelectProfile) {
                    // ✅ EXACT profile (keeps side)
                    onSelectProfile(profile);
                  } else if (onSelect) {
                    // ✅ Legacy behavior (history pages)
                    onSelect(bodyPartCode);
                  }
                }}
                className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {combineSides
                  ? profile.bodyPartName
                  : bodyPartLabel(profile)}
              </button>
            </li>
          );
        })}

        {!loading && sidebarItems.length === 0 && (
          <li className="text-sm text-muted-foreground">
            No body parts found
          </li>
        )}
      </ul>
    </aside>
  );
}
