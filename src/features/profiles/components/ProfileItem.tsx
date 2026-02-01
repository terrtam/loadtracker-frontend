/** Component for a Body Part Profile item.
 *  Displays a single body part profile with its side.
 *  Supports selection.
 *  Provides context menu for archiving/unarchiving.
 *  Loads display labels from app config.
 *  Notifies parent when profile state changes.
 */

import { useEffect, useRef, useState } from "react";
import type { BodyPartProfile } from "../types";
import { archiveProfile, unarchiveProfile } from "../api";
import { loadAppConfig } from "../../../shared/config/loadConfig";

type Props = {
  profile: BodyPartProfile;
  action: "archive" | "unarchive";
  isSelected: boolean;
  onSelect?: (profile: BodyPartProfile) => void;
  onChange: () => void;
};

export default function ProfileItem({ profile, action, isSelected,
  onSelect, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [bodyParts, setBodyParts] =
    useState<Record<string, string> | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadAppConfig()
      .then((config) => setBodyParts(config.bodyParts))
      .catch(() => setBodyParts({}));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleAction = async () => {
    if (action === "archive") {
      await archiveProfile(profile.id);
    } else {
      await unarchiveProfile(profile.id);
    }

    setOpen(false);
    onChange();
  };

  const bodyPartLabel =
    bodyParts?.[profile.bodyPartName] ?? profile.bodyPartName;

  return (
    <li
      className={`relative flex justify-between items-center px-2 py-1 rounded cursor-pointer
        ${
          isSelected
            ? "bg-blue-100 font-medium"
            : "hover:bg-gray-100"
        }`}
      onClick={() => onSelect?.(profile)}
    >
      <span className="text-sm">
        {bodyPartLabel} — {profile.side}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="px-2 py-1 rounded hover:bg-gray-200"
      >
        ⋮
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-2 top-8 z-10 w-28 rounded border bg-white shadow"
        >
          <button
            onClick={handleAction}
            className="block w-full px-3 py-2 text-left hover:bg-gray-100"
          >
            {action === "archive" ? "Archive" : "Unarchive"}
          </button>
        </div>
      )}
    </li>
  );
}
