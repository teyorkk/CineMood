import type { IRecommendationRepository } from "@/app/core/domain/repositories/IRecommendationRepository";
import type {
  RecommendationRequest,
  Movie,
  Series,
} from "@/app/core/domain/entities/types";

export class GenerateRecommendationsUseCase {
  constructor(private recommendationRepository: IRecommendationRepository) {}

  async execute(request: RecommendationRequest): Promise<(Movie | Series)[]> {
    if (!request.mood || request.genres.length === 0) {
      throw new Error("Mood and at least one genre are required");
    }
    return this.recommendationRepository.generateRecommendations(request);
  }
}
