"use client";
import { clsx } from "clsx";

const GENRES = [
  "Action","Comedy","Drama","Horror","Sci-Fi","Romance","Thriller","Documentary","Fantasy","Mystery","Animation"
];

export function GenreSelector({ values, onToggle }: { values: string[]; onToggle: (g: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((g) => {
        const active = values.includes(g);
        return (
          <button
            key={g}
            type="button"
            onClick={() => onToggle(g)}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-xs transition-all",
              active
                ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-sm ring-1 ring-indigo-500/40"
                : "bg-white/60 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 border-zinc-200 dark:border-white/10"
            )}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}
