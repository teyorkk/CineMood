import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { N8NClient } from "@/app/core/infrastructure/api/n8nClient";
import { TMDBClient } from "@/app/core/infrastructure/api/tmdbClient";
import { WebhookRecommendationRepository } from "@/app/core/infrastructure/adapters/WebhookRecommendationRepository";
import type { RecommendationRequest } from "@/app/core/domain/entities/types";

const BodySchema = z.object({
  mood: z.string().min(1),
  genres: z.array(z.string()).min(1),
  contentType: z.enum(["movie", "series", "both"]).default("both"),
  timeAvailable: z.enum(["short", "standard", "long", "series"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.parse(json);

    const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK;
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!WEBHOOK_URL || !TMDB_API_KEY) {
      return NextResponse.json({ error: "Server missing N8N_WEBHOOK_URL or TMDB_API_KEY" }, { status: 500 });
    }

    const n8n = new N8NClient(WEBHOOK_URL);
    const tmdb = new TMDBClient(TMDB_API_KEY);
    const repo = new WebhookRecommendationRepository(n8n, tmdb);

    const request: RecommendationRequest = parsed;
    const recommendations = await repo.generateRecommendations(request);

    return NextResponse.json({ recommendations });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 400 });
  }
}
