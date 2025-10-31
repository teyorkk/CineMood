import type { IRecommendationRepository } from "@/app/core/domain/repositories/IRecommendationRepository";
import type {
  RecommendationRequest,
  Movie,
  Series,
} from "@/app/core/domain/entities/types";
import { N8NClient } from "@/app/core/infrastructure/api/n8nClient";
import { TMDBClient } from "@/app/core/infrastructure/api/tmdbClient";

export class WebhookRecommendationRepository
  implements IRecommendationRepository
{
  constructor(private webhook: N8NClient, private tmdb: TMDBClient) {}

  async generateRecommendations(
    request: RecommendationRequest
  ): Promise<(Movie | Series)[]> {
    const ai = await this.webhook.generateRecommendations({
      mood: request.mood,
      genres: request.genres,
      contentType: request.contentType,
      timeAvailable: request.timeAvailable,
    });

    const out: (Movie | Series)[] = [];
    for (const rec of ai) {
      const type = rec.type === "series" ? "tv" : "movie";
      const search = await this.tmdb.search(rec.title, rec.year, type);
      const best = search.results?.[0];
      if (!best) continue;
      const details = await this.tmdb.getDetails(best.id, type);
      const credits = details.credits || {};
      const castArr = (credits.cast || []).slice(0, 5);
      const cast = castArr.map((c: any) => c.name).filter(Boolean);
      const castDetails = castArr.map((c: any) => ({
        name: c.name as string,
        profileUrl: c.profile_path
          ? this.tmdb.imageUrl(c.profile_path, "w185")
          : undefined,
      }));

      const computedYear =
        Number(
          (type === "movie"
            ? details.release_date
            : details.first_air_date
          )?.slice(0, 4)
        ) ||
        rec.year ||
        0;
      const displayTitle = type === "movie" ? details.title : details.name;
      const common = {
        id: String(details.id),
        title: displayTitle,
        year: computedYear,
        cast,
        castDetails,
        synopsis: details.overview || "",
        posterUrl: this.tmdb.imageUrl(details.poster_path, "w500"),
        backdropUrl: this.tmdb.imageUrl(details.backdrop_path, "w780"),
        rating: Number(details.vote_average || 0),
        genres: (details.genres || []).map((g: any) => g.name),
        streamingPlatforms: await this.tmdb.getStreamingProviders(
          details.id,
          type
        ),
        trailerUrl: this.tmdb.trailerUrlFromVideos(details.videos),
        imdbUrl: details?.external_ids?.imdb_id
          ? `https://www.imdb.com/title/${details.external_ids.imdb_id}/`
          : undefined,
        letterboxdUrl: `https://letterboxd.com/search/${encodeURIComponent(
          `${displayTitle} ${computedYear || ""}`
        )}/`,
        moodMatch: rec.moodMatch || "",
      } as const;

      if (type === "movie") {
        const director =
          (credits.crew || []).find((p: any) => p.job === "Director")?.name ||
          "";
        const runtime = Number(details.runtime || 0);
        const movie: Movie = { ...common, director, runtime } as Movie;
        out.push(movie);
      } else {
        const creator = (details.created_by || [])[0]?.name || "";
        const seasons = Number(details.number_of_seasons || 1);
        const episodeCount = Number(details.number_of_episodes || 0);
        const series: Series = {
          ...common,
          creator,
          seasons,
          episodeCount,
        } as Series;
        out.push(series);
      }
    }
    return out;
  }

  async fetchMovieDetails(movieId: string): Promise<Movie> {
    const id = Number(movieId);
    const d = await this.tmdb.getDetails(id, "movie");
    const credits = d.credits || {};
    const cast = (credits.cast || [])
      .slice(0, 5)
      .map((c: any) => c.name)
      .filter(Boolean);
    const director =
      (credits.crew || []).find((p: any) => p.job === "Director")?.name || "";
    return {
      id: String(d.id),
      title: d.title,
      year: Number((d.release_date || "").slice(0, 4)) || 0,
      director,
      cast,
      synopsis: d.overview || "",
      posterUrl: this.tmdb.imageUrl(d.poster_path, "w500"),
      backdropUrl: this.tmdb.imageUrl(d.backdrop_path, "w780"),
      rating: Number(d.vote_average || 0),
      runtime: Number(d.runtime || 0),
      genres: (d.genres || []).map((g: any) => g.name),
      streamingPlatforms: await this.tmdb.getStreamingProviders(d.id, "movie"),
      trailerUrl: this.tmdb.trailerUrlFromVideos(d.videos),
      moodMatch: "",
    };
  }

  async fetchSeriesDetails(seriesId: string): Promise<Series> {
    const id = Number(seriesId);
    const d = await this.tmdb.getDetails(id, "tv");
    const credits = d.credits || {};
    const cast = (credits.cast || [])
      .slice(0, 5)
      .map((c: any) => c.name)
      .filter(Boolean);
    const creator = (d.created_by || [])[0]?.name || "";
    return {
      id: String(d.id),
      title: d.name,
      year: Number((d.first_air_date || "").slice(0, 4)) || 0,
      creator,
      cast,
      synopsis: d.overview || "",
      posterUrl: this.tmdb.imageUrl(d.poster_path, "w500"),
      backdropUrl: this.tmdb.imageUrl(d.backdrop_path, "w780"),
      rating: Number(d.vote_average || 0),
      seasons: Number(d.number_of_seasons || 1),
      episodeCount: Number(d.number_of_episodes || 0),
      genres: (d.genres || []).map((g: any) => g.name),
      streamingPlatforms: await this.tmdb.getStreamingProviders(d.id, "tv"),
      trailerUrl: this.tmdb.trailerUrlFromVideos(d.videos),
      moodMatch: "",
    };
  }
}
