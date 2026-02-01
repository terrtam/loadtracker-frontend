/** Page to log pain and fatigue.
 *  Manages form state, submission, and success/error feedback.
 */

import { useEffect, useState } from "react";
import BodyPartSidebar from "../features/profiles/components/BodyPartSidebar";
import type { BodyPartProfile } from "../features/profiles/types";
import { createWellnessLog } from "../features/wellness/api";
import axios from "axios";

export default function WellnessLogPage() {
  const [selectedProfile, setSelectedProfile] = useState<BodyPartProfile | null>(null);

  const [pain, setPain] = useState(0);
  const [fatigue, setFatigue] = useState(0);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = !!selectedProfile && !submitting;

  const todayLocal = new Date().toISOString().slice(0, 10);
  const oneYearAgoLocal = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
  })();

  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const t = setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(t);
  }, [successMessage, errorMessage]);

  const handleSubmit = async () => {
    if (!selectedProfile) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);

      await createWellnessLog({
        bodyPartProfileId: selectedProfile.id,
        painScore: pain,
        fatigueScore: fatigue,
        loggedAt: new Date(date + "T12:00:00").toISOString(),
      });

      setSuccessMessage("Wellness logged successfully!");

      setPain(0);
      setFatigue(0);
      setDate(todayLocal);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrorMessage(
          err.response?.data?.message ||
            "Failed to log wellness"
        );
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to log wellness");
      }

      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full">
      <BodyPartSidebar
        selectedProfileId={selectedProfile?.id ?? null}
        onSelectProfile={setSelectedProfile}
      />

      <main className="flex-1 max-w-xl p-6">
        <h1 className="mb-6 text-2xl font-bold">
          Log Wellness
        </h1>

        {/* Feedback */}
        {successMessage && (
          <div className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        <div className="mb-6">
          <input
            type="date"
            value={date}
            min={oneYearAgoLocal}
            max={todayLocal}
            onChange={(e) => setDate(e.target.value)}
            className="rounded border px-2 py-1"
          />
        </div>

        {selectedProfile ? (
          <div className="mb-6 rounded border bg-muted px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Logging for
            </div>
            <div className="text-lg font-semibold">
              {selectedProfile.bodyPartName}{" "}
              <span className="capitalize text-muted-foreground">
                ({selectedProfile.side})
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded border border-dashed p-4 text-sm text-muted-foreground">
            Select a body part from the sidebar to begin.
          </div>
        )}

        <div
          className={`space-y-6 transition-opacity ${
            selectedProfile ? "opacity-100" : "opacity-50"
          }`}
        >
          <div>
            <label className="mb-1 block font-medium">
              Pain: {pain}
            </label>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={pain}
              disabled={!selectedProfile}
              onChange={(e) =>
                setPain(Number(e.target.value))
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Fatigue: {fatigue}
            </label>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={fatigue}
              disabled={!selectedProfile}
              onChange={(e) =>
                setFatigue(Number(e.target.value))
              }
              className="w-full"
            />
          </div>

          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`rounded px-4 py-2 text-white ${
              canSubmit
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Log Wellness
          </button>
        </div>
      </main>
    </div>
  );
}
