"use client";
import { useState } from "react";
import { MoodSelector } from "@/app/presentation/components/MoodSelector";
import { GenreSelector } from "@/app/presentation/components/GenreSelector";
import { useRecommendations } from "@/app/presentation/hooks/useRecommendations";
import type { ContentType } from "@/app/core/domain/entities/types";
import { RecommendationCard } from "@/app/presentation/components/RecommendationCard";
import { Select } from "@/app/presentation/components/Select";

export default function Home() {
  const [mood, setMood] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
  const [contentType, setContentType] = useState<ContentType>("both");
  const [timeAvailable, setTimeAvailable] = useState<
    "short" | "standard" | "long" | "series" | undefined
  >(undefined);
  const { loading, error, items, getRecommendations } = useRecommendations();

  const toggleGenre = (g: string) => {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(120,119,198,0.25)_0,rgba(255,255,255,0)_50%)] dark:bg-[radial-gradient(100%_50%_at_50%_0%,rgba(120,119,198,0.15)_0,rgba(0,0,0,0)_50%)]">
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-center sm:text-left">
            CineMood
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 text-center sm:text-left">
            Personalized movie & series picks based on your mood.
          </p>
        </header>

        <section className="grid gap-6 rounded-2xl border border-zinc-200 dark:border-white/10 p-5 bg-white/60 dark:bg-white/5">
          <div>
            <h2 className="text-sm font-medium mb-2">How are you feeling?</h2>
            <MoodSelector value={mood} onChange={setMood} />
          </div>

          <div>
            <h2 className="text-sm font-medium mb-2">Pick some genres</h2>
            <GenreSelector values={genres} onToggle={toggleGenre} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm w-28">Content</label>
              <Select
                value={contentType}
                onValueChange={(v) => setContentType(v as ContentType)}
                options={[
                  { value: "both", label: "Both" },
                  { value: "movie", label: "Movies" },
                  { value: "series", label: "TV Series" },
                ]}
                placeholder="Content type"
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm w-28">Time</label>
              <Select
                value={timeAvailable ?? "any"}
                onValueChange={(v) =>
                  setTimeAvailable(v === "any" ? undefined : (v as any))
                }
                options={[
                  { value: "any", label: "Any" },
                  { value: "short", label: "Short (<90m)" },
                  { value: "standard", label: "Standard (90-120m)" },
                  { value: "long", label: "Long (120m+)" },
                  { value: "series", label: "Series" },
                ]}
                placeholder="Time available"
                className="w-full"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                disabled={loading || !mood || genres.length === 0}
                onClick={() =>
                  getRecommendations({
                    mood,
                    genres,
                    contentType,
                    timeAvailable,
                  })
                }
                className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:brightness-110 active:brightness-95 disabled:opacity-50"
              >
                {loading ? "Getting picks…" : "Get Recommendations"}
              </button>
            </div>
          </div>
        </section>
        {!mood || genres.length === 0 ? (
          <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
            Tip: select a mood and at least one genre to enable the button.
          </p>
        ) : null}

        {error && (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/40">
            {error}
          </div>
        )}

        <section className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-white/5"
                >
                  <div className="relative aspect-2/3 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 animate-pulse" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full animate-pulse" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <RecommendationCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
