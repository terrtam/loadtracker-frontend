import { useEffect, useState } from "react";
import { createBodyPartProfile } from "../../api/bodyPartProfiles";
import { loadAppConfig } from "../../config/loadConfig";

type BodyPartName = string;

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function CreateBodyPartProfile({
  onSuccess,
  onCancel,
}: Props) {
  const [bodyParts, setBodyParts] =
    useState<Record<string, string> | null>(null);

  const [bodyPart, setBodyPart] = useState<BodyPartName | "">("");
  const [side, setSide] = useState<"left" | "right">("left");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load config on mount
  useEffect(() => {
    loadAppConfig()
      .then((config) => setBodyParts(config.bodyParts))
      .catch(() => setError("Failed to load body parts"));
  }, []);

  const submit = async () => {
    if (!bodyPart || loading) return;

    try {
      setLoading(true);
      setError(null);

      await createBodyPartProfile({
        bodyPartName: bodyPart,
        side,
      });

      setBodyPart("");
      setSide("left");
      onSuccess();
    } catch {
      setError("Profile already exists or failed to create.");
    } finally {
      setLoading(false);
    }
  };

  if (!bodyParts) {
    return <div>Loading body parts…</div>;
  }

  return (
    <div className="max-w-md space-y-6">
      <h2 className="text-xl font-semibold">Create Body Part Profile</h2>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Body part dropdown */}
      <div>
        <label className="block mb-1 font-medium">Body Part</label>
        <select
          value={bodyPart}
          onChange={(e) => setBodyPart(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select body part</option>
          {Object.entries(bodyParts).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Side selector */}
      <div>
        <label className="block mb-1 font-medium">Side</label>
        <div className="flex gap-2">
          {(["left", "right"] as const).map((s) => {
            const label = s.charAt(0).toUpperCase() + s.slice(1);

            return (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`px-4 py-2 rounded-full border transition ${
                  side === s
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={loading || !bodyPart}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
