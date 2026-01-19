import { useState } from "react";
import SidebarLayout from "../components/layout/SidebarLayout";
import DashboardSidebar from "../components/Sidebar/DashboardSidebar";
import CreateBodyPartProfile from "../components/Profiles/CreateBodyPartProfile";
import WellnessCharts from "../components/wellness/WellnessCharts";
import VolumeCharts from "../components/volume/VolumeCharts";
import type { BodyPartProfile } from "../types/bodyPartProfile";
import { useDashboardAggregation } from "../hooks/useDashboardAggregation";

export default function Dashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProfile, setSelectedProfile] =
    useState<BodyPartProfile | null>(null);

  const { aggregation, setDaily, setWeekly, setMonthly } =
    useDashboardAggregation("daily");

  return (
    <SidebarLayout
      sidebar={
        <DashboardSidebar
          key={refreshKey}
          onAddProfile={() => setShowCreate(true)}
          selectedProfile={selectedProfile}
          onSelectProfile={setSelectedProfile}
        />
      }
    >
      {showCreate ? (
        <CreateBodyPartProfile
          onSuccess={() => {
            setShowCreate(false);
            setRefreshKey((k) => k + 1);
          }}
          onCancel={() => setShowCreate(false)}
        />
      ) : (
        <div className="p-6 space-y-6">

          {/* 🔁 GLOBAL TOGGLE */}
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded ${
                aggregation === "daily"
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
              onClick={setDaily}
            >
              Daily
            </button>
            <button
              className={`px-3 py-1 rounded ${
                aggregation === "weekly"
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
              onClick={setWeekly}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 rounded ${
                aggregation === "monthly"
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
              onClick={setMonthly}
            >
              Monthly
            </button>
          </div>

          <VolumeCharts
            profile={selectedProfile}
            aggregation={aggregation}
          />

          <WellnessCharts
            profiles={selectedProfile ? [selectedProfile] : []}
            aggregation={aggregation}
          />
        </div>
      )}
    </SidebarLayout>
  );
}
