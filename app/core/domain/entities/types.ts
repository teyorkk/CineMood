export type ContentType = "movie" | "series" | "both";

export interface StreamingPlatform {
  name: string;
  url?: string;
  logoPath?: string;
}

export interface BaseMediaEntity {
  id: string;
  title: string;
  year: number;
  cast: string[];
  castDetails?: Array<{
    name: string;
    profileUrl?: string;
  }>;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number; // Average rating 0-10
  genres: string[];
  streamingPlatforms: StreamingPlatform[];
  trailerUrl?: string;
  imdbUrl?: string;
  letterboxdUrl?: string;
  moodMatch: string; // AI-generated explanation
}

export interface Movie extends BaseMediaEntity {
  director: string;
  runtime: number; // minutes
}

export interface Series extends BaseMediaEntity {
  creator: string;
  seasons: number;
  episodeCount: number;
}

export interface RecommendationRequest {
  mood: string;
  genres: string[];
  contentType: ContentType;
  timeAvailable?: "short" | "standard" | "long" | "series";
}
