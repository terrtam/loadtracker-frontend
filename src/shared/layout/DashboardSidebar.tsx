/** Layout for Dashboard Sidebar.
 *  Fetches and reloads profile lists.
 *  Renders sidebar for selecting, archiving, and restoring body-part profiles.
 */

import { useEffect, useState } from "react";
import { getBodyPartProfiles } from "../../features/profiles/api";
import type { BodyPartProfile } from "../../features/profiles/types";
import ProfileList from "../../features/profiles/components/ProfileList";

type Props = {
  onAddProfile: () => void;
  selectedProfile: BodyPartProfile | null;
  onSelectProfile: (profile: BodyPartProfile | null) => void;
};


export default function DashboardSidebar({ onAddProfile, selectedProfile, onSelectProfile }: Props) {
  const [activeProfiles, setActiveProfiles] = useState<BodyPartProfile[]>([]);
  const [archivedProfiles, setArchivedProfiles] = useState<BodyPartProfile[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfiles() {
      const active = await getBodyPartProfiles(false);
      const archived = await getBodyPartProfiles(true);

      if (isMounted) {
        setActiveProfiles(active);
        setArchivedProfiles(archived);
      }
    }

    fetchProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

  const reloadProfiles = async () => {
    const active = await getBodyPartProfiles(false);
    const archived = await getBodyPartProfiles(true);

    setActiveProfiles(active);
    setArchivedProfiles(archived);
  };

  return (
    <aside className="w-64 border-r p-4">
      <ProfileList
        title="Active Profiles"
        profiles={activeProfiles}
        action="archive"
        selectedProfile={selectedProfile}
        onSelectProfile={onSelectProfile}
        onAdd={onAddProfile}
        onChange={reloadProfiles}
      />

      <ProfileList
        title="Archived Profiles"
        profiles={archivedProfiles}
        action="unarchive"
        selectedProfile={selectedProfile}
        onSelectProfile={onSelectProfile}
        onChange={reloadProfiles}
      />
    </aside>
  );
}
