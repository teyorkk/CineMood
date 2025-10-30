"use client";
import Image from "next/image";
import { Star, Play } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Movie, Series } from "@/app/core/domain/entities/types";

export type Recommendation = Movie | Series;

export function RecommendationCard({ item }: { item: Recommendation }) {
  const title = item.title;
  const sub = "director" in item ? `Dir. ${item.director} • ${item.year}` : `Creator ${item.creator} • ${item.year}`;
  const poster = item.posterUrl || item.backdropUrl || "";

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group text-left w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="relative aspect-2/3 w-full overflow-hidden">
            {poster ? (
              <>
                <Image src={poster} alt={title} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-end bg-zinc-200 dark:bg-zinc-800 p-3">
                <span className="text-xs text-zinc-700 dark:text-zinc-300">No image available</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-start gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {item.trailerUrl && (
                <a
                  href={item.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur hover:bg-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Play className="h-4 w-4" /> Trailer
                </a>
              )}
            </div>
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate" title={title}>{title}</h3>
              <div className="inline-flex items-center gap-1 text-amber-500"><Star className="h-4 w-4" /> <span className="text-sm">{item.rating.toFixed(1)}</span></div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">{sub}</p>
            <p className="text-sm mt-2 line-clamp-3 text-zinc-700 dark:text-zinc-300">{item.moodMatch}</p>
          </div>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(90vw,1000px)] max-h-[85vh] overflow-hidden -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-2/3 md:h-[85vh] md:aspect-auto bg-black">
              {poster ? (
                <Image src={poster} alt={title} fill className="object-contain rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
              ) : (
                <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
              )}
            </div>
            <div className="p-5 md:p-6 overflow-y-auto md:max-h-[85vh] scrollbar-dark">
              <Dialog.Title className="text-xl font-semibold flex items-center justify-between gap-3">
                <span className="truncate" title={title}>{title}</span>
                <span className="shrink-0 inline-flex items-center gap-1 text-amber-500"><Star className="h-4 w-4" /> {item.rating.toFixed(1)}</span>
              </Dialog.Title>
              <Dialog.Description className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{sub}</Dialog.Description>

              <p className="text-sm mt-3 text-zinc-700 dark:text-zinc-200 leading-relaxed">{item.synopsis}</p>

              {item.moodMatch ? (
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Mood match</h4>
                  <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">{item.moodMatch}</p>
                </div>
              ) : null}

              {item.genres?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.genres.map((g) => (
                    <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-white/10">{g}</span>
                  ))}
                </div>
              ) : null}

              {item.castDetails?.length ? (
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Top cast</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {item.castDetails.map((c: { name: string; profileUrl?: string }) => (
                      <div key={c.name} className="flex items-center gap-2">
                        {c.profileUrl ? (
                          <Image src={c.profileUrl} alt={c.name} width={32} height={32} className="rounded-full object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 grid place-items-center text-[10px] text-zinc-500 dark:text-zinc-300">
                            {c.name.split(" ").map((n: string) => n[0]).join("")}
                          </div>
                        )}
                        <span className="text-xs text-zinc-700 dark:text-zinc-200 truncate" title={c.name}>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 flex items-center gap-2">
                {item.trailerUrl && (
                  <a
                    href={item.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white text-sm px-3 py-2 hover:brightness-110"
                  >
                    <Play className="h-4 w-4" /> Watch trailer
                  </a>
                )}
                {item.imdbUrl && (
                  <a
                    href={item.imdbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-white/10 text-sm px-3 py-2 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-white/5"
                  >
                    IMDb
                  </a>
                )}
                {item.letterboxdUrl && (
                  <a
                    href={item.letterboxdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-white/10 text-sm px-3 py-2 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-white/5"
                  >
                    Letterboxd
                  </a>
                )}
                <Dialog.Close asChild>
                  <button type="button" className="ml-auto inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-white/10 text-sm px-3 py-2 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-white/5">
                    Close
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
