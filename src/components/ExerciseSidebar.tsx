import { useMemo, useState } from "react";
import type { AppConfig } from "../types/appConfig";

type Props = {
  config: AppConfig;
  onSelectExercise: (exerciseCode: string) => void;
};

export default function ExerciseSidebar({ config, onSelectExercise }: Props) {
  const [query, setQuery] = useState("");

  const exercises = useMemo(() => {
    return Object.entries(config.exercises).filter(([, ex]) =>
      ex.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [config, query]);

  return (
    <aside className="w-64 border-r p-4">
      <input
        className="w-full border px-2 py-1 mb-3"
        placeholder="Search exercises"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="space-y-1">
        {exercises.map(([code, ex]) => (
          <button
            key={code}
            onClick={() => onSelectExercise(code)}
            className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
          >
            {ex.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
