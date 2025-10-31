# CinemaMood — mood-based movie/series picks (Next.js + n8n + TMDB)

CinemaMood gives personalized film/TV recommendations from your mood and genres. It uses an n8n webhook for suggestions, enriches details with TMDB (trailers, posters, cast, IMDb), and presents everything in a sleek Next.js app with Radix UI and Tailwind v4.

## Key features

- Mood + genre driven recommendations via n8n webhook
- TMDB enrichment: posters/backdrops, synopsis, rating, cast headshots, trailers, IMDb id
- Letterboxd link and IMDb button on each title
- In-app details modal (Radix Dialog) showing the full poster, mood match, genres, and top cast
- Polished UX: animated cards, custom dropdowns, skeleton loading, dark scrollbar
- Clean Architecture inside `app/` (domain, use-cases, infrastructure, presentation)

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Radix UI (Dialog, Select)
- Zod for validation
- TMDB API for media data and images
- n8n Webhook for AI-like suggestions

## Project structure

```
app/
  api/recommendations/route.ts                 # API: POST -> n8n webhook -> enrich with TMDB
  core/
    domain/
      entities/types.ts                        # Movie/Series entities and request types
    infrastructure/
      api/n8nClient.ts                         # Calls n8n webhook, robust parser
      api/tmdbClient.ts                        # TMDB helpers (details, images, trailer)
      adapters/WebhookRecommendationRepository.ts # Maps webhook items -> enriched media
  presentation/
    components/{MoodSelector,GenreSelector,Select,RecommendationCard}.tsx
    hooks/useRecommendations.ts
  page.tsx                                     # Main UI wiring

next.config.ts                                  # TMDB images allowlist
```

## Prerequisites

- Node.js 18+ (20+ recommended)
- Accounts/keys:
  - TMDB v3 API Key: `TMDB_API_KEY`
  - n8n public webhook URL: `N8N_WEBHOOK_URL`

## Environment variables

Create a `.env.local` file in the project root:

```env
N8N_WEBHOOK_URL=https://your-n8n-host/webhook/your-id
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Install and run (Windows PowerShell)

```powershell
pnpm install
pnpm dev
```

Then open http://localhost:3000

## Build and start (production)

```powershell
pnpm build
pnpm start
```

## Troubleshooting

- n8n 404 Not Found: Ensure the webhook exists and is “enabled” or currently running in Test mode. The app expects a JSON body shaped like `{ recommendations: [...] }`.
- Images not loading: `next.config.ts` allowlists `image.tmdb.org`. If you add other image sources, update `images.remotePatterns`.
- Multiple lockfiles warning: This repo uses pnpm (`pnpm-lock.yaml`). If you also have `package-lock.json`, delete it to silence warnings.

## Notes

- Images are fetched from TMDB only (no generated images).
- Console logs were removed for cleanliness; API errors are surfaced as JSON without server logs.
- UI requires selecting a mood and at least one genre to enable recommendations.
