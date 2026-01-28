import type { BodyPartProfile } from "../types";
import ProfileItem from "./ProfileItem";

type Props = {
  title: string;
  profiles: BodyPartProfile[];
  action: "archive" | "unarchive";
  selectedProfile: BodyPartProfile | null;
  onSelectProfile: (profile: BodyPartProfile | null) => void;
  onAdd?: () => void;
  onChange: () => void;
};

export default function ProfileList({
  title,
  profiles,
  action,
  selectedProfile,
  onSelectProfile,
  onAdd,
  onChange,
}: Props) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{title}</h3>

        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="text-xl hover:text-blue-600"
          >
            ＋
          </button>
        )}
      </div>

      {profiles.length === 0 && (
        <p className="text-sm text-gray-500">None</p>
      )}

      <ul className="space-y-1">
        {profiles.map((profile) => (
          <ProfileItem
            key={profile.id}
            profile={profile}
            action={action}
            isSelected={selectedProfile?.id === profile.id}
            onSelect={
              action === "archive" ? onSelectProfile : undefined
            }
            onChange={onChange}
          />
        ))}
      </ul>
    </div>
  );
}
