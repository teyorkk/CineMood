Movie/Series Recommendation Bot (Next.js + Gemini + TMDB)
=========================================================

Personalized movie and TV series recommendations based on your mood and preferred genres. Built with Next.js App Router, Tailwind CSS v4, and a clean architecture inside the `app/` folder.

Project structure
-----------------

```
app/
	api/recommendations/route.ts        # API route calling Gemini + TMDB
	core/
		domain/
			entities/types.ts               # Movie/Series entities and request types
			repositories/IRecommendationRepository.ts
			use-cases/GenerateRecommendationsUseCase.ts
		infrastructure/
			api/{geminiClient,tmdbClient}.ts
			adapters/GeminiRecommendationRepository.ts
	presentation/
		components/{MoodSelector,GenreSelector,RecommendationCard}.tsx
		hooks/useRecommendations.ts
	page.tsx                            # UI wiring
```

Prerequisites
-------------

- Node.js 18+
- API / Webhook:
	- n8n webhook URL: `N8N_WEBHOOK_URL`
	- TMDB v3: `TMDB_API_KEY`

Create a `.env.local` file:

```
N8N_WEBHOOK_URL=https://your-n8n-host/webhook/your-id
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Install and run
---------------

```powershell
pnpm install
pnpm dev
```

Open http://localhost:3000 and pick a mood and genres, then click "Get Recommendations".

Notes
-----

- The server calls your n8n webhook to get mood-based suggestions, then enriches with TMDB.
- Images come directly from TMDB (no AI image generation).
- Data is fetched on-demand from the API route and not persisted.
- Tailwind v4 classes are used; Radix Select powers custom dropdowns.
