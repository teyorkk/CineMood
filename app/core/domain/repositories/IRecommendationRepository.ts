import type { RecommendationRequest, Movie, Series } from "@/app/core/domain/entities/types";

export interface IRecommendationRepository {
  generateRecommendations(request: RecommendationRequest): Promise<(Movie | Series)[]>;
  fetchMovieDetails(movieId: string): Promise<Movie>;
  fetchSeriesDetails(seriesId: string): Promise<Series>;
}
