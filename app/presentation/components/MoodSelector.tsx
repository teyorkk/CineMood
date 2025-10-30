"use client";
import { Sparkles, Heart, Laugh, CloudSun, Ghost, Compass, Brain, Flower2, Zap } from "lucide-react";
import { clsx } from "clsx";

const MOODS = [
  { key: "Happy", icon: Laugh },
  { key: "Sad", icon: CloudSun },
  { key: "Excited", icon: Zap },
  { key: "Relaxed", icon: Flower2 },
  { key: "Romantic", icon: Heart },
  { key: "Adventurous", icon: Compass },
  { key: "Thoughtful", icon: Brain },
  { key: "Scared", icon: Ghost },
  { key: "Energetic", icon: Sparkles },
] as const;

export function MoodSelector({ value, onChange }: { value: string; onChange: (m: string) => void }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {MOODS.map(({ key, icon: Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={clsx(
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all",
              active
                ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/40"
                : "bg-white/60 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 border-zinc-200 dark:border-white/10"
            )}
            aria-pressed={active}
          >
            <Icon className={clsx("h-4 w-4", active ? "opacity-100" : "opacity-80")} />
            <span>{key}</span>
          </button>
        );
      })}
    </div>
  );
}
