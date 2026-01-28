import { useState } from "react";
import BodyPartSidebar from "../features/profiles/components/BodyPartSidebar";
import type { BodyPartProfile } from "../features/profiles/types";
import { createWellnessLog } from "../features/wellness/api";
import axios from "axios";

export default function WellnessLogPage() {
  /* -------------------------
     Sidebar selection (PROFILE)
  --------------------------*/
  const [selectedProfile, setSelectedProfile] =
    useState<BodyPartProfile | null>(null);

  /* -------------------------
     Wellness inputs
  --------------------------*/
  const [pain, setPain] = useState(0);
  const [fatigue, setFatigue] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = !!selectedProfile && !submitting;

  

  /* -------------------------
    Date
  --------------------------*/

  const todayLocal = new Date().toISOString().slice(0, 10);

  const oneYearAgoLocal = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().slice(0, 10);
  })();
  const [date, setDate] = useState<string>(todayLocal);


  /* -------------------------
     Submit
  --------------------------*/
  const submitWellness = async () => {
    if (!selectedProfile) return;

    try {
      setSubmitting(true);

      await createWellnessLog({
        bodyPartProfileId: selectedProfile.id,
        painScore: pain,
        fatigueScore: fatigue,
        loggedAt: new Date(date + "T12:00:00").toISOString()
      });

      alert("Wellness logged successfully!");

      setPain(0);
      setFatigue(0);
      setDate(todayLocal);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(
          err.response?.data?.message ||
            "Failed to log wellness"
        );
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to log wellness");
      }

      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------------
     Render
  --------------------------*/
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <BodyPartSidebar
        selectedBodyPartCode={null}
        onSelectProfile={setSelectedProfile}
      />

      {/* Main */}
      <main className="flex-1 max-w-xl p-6">
        <h1 className="mb-6 text-2xl font-bold">
          Log Wellness
        </h1>
        <div className="mb-6">
          <input
            type="date"
            value={date}
            min={oneYearAgoLocal}
            max={todayLocal}
            onChange={(e) => setDate(e.target.value)}
            className="mb-6 rounded border px-2 py-1"
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

        {/* Form */}
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
            onClick={submitWellness}
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
