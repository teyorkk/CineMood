import type { StreamingPlatform } from "@/app/core/domain/entities/types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export type TMDBMediaType = "movie" | "tv";

export class TMDBClient {
  constructor(private apiKey: string) {}

  private qs(params: Record<string, string | number | boolean | undefined>) {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) search.set(k, String(v));
    }
    return search.toString();
  }

  imageUrl(
    path: string | null | undefined,
    size: "w185" | "w342" | "w500" | "w780" | "original" = "w500"
  ): string {
    if (!path) return "";
    return `${IMAGE_BASE}/${size}${path}`;
  }

  async search(title: string, year?: number, type: TMDBMediaType = "movie") {
    const endpoint = `${TMDB_BASE}/search/${type}`;
    const url = `${endpoint}?${this.qs({
      query: title,
      year: type === "movie" ? year : undefined,
      first_air_date_year: type === "tv" ? year : undefined,
      include_adult: false,
      language: "en-US",
      api_key: this.apiKey,
    })}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
    return res.json();
  }

  async getDetails(id: number, type: TMDBMediaType) {
    const endpoint = `${TMDB_BASE}/${type}/${id}`;
    const url = `${endpoint}?${this.qs({
      language: "en-US",
      append_to_response:
        "credits,videos,release_dates,content_ratings,external_ids",
      api_key: this.apiKey,
    })}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDB details failed: ${res.status}`);
    return res.json();
  }

  async getStreamingProviders(
    id: number,
    type: TMDBMediaType
  ): Promise<StreamingPlatform[]> {
    const endpoint = `${TMDB_BASE}/${type}/${id}/watch/providers`;
    const url = `${endpoint}?${this.qs({ api_key: this.apiKey })}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const us = data?.results?.US;
    const flatrate: any[] = us?.flatrate || [];
    const rent: any[] = us?.rent || [];
    const buy: any[] = us?.buy || [];
    const all = [...flatrate, ...rent, ...buy];
    const map = new Map<string, StreamingPlatform>();
    for (const p of all) {
      const name = String(p.provider_name);
      if (!map.has(name)) {
        map.set(name, {
          name,
          logoPath: p.logo_path
            ? this.imageUrl(p.logo_path, "w185")
            : undefined,
        });
      }
    }
    return [...map.values()];
  }

  trailerUrlFromVideos(videos: any): string | undefined {
    const yt = (videos?.results || []).find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer"
    );
    return yt ? `https://www.youtube.com/watch?v=${yt.key}` : undefined;
  }
}
