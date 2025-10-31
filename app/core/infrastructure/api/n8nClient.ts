import { z } from "zod";

// Accept both our normalized shape and the webhook's capitalized keys with spaces.
const NormalizedItem = z
  .object({
    title: z.string(),
    year: z.coerce.number().int().optional(),
    moodMatch: z.string().optional(),
    type: z.string().optional(),
  })
  .transform((i) => ({
    title: i.title,
    year: typeof i.year === "number" ? i.year : undefined,
    moodMatch: i.moodMatch ?? "",
    type: (i.type ?? "movie").toLowerCase() === "series" ? "series" : "movie",
  }));

const WebhookCapsItem = z
  .object({
    "Movie title": z.string(),
    Year: z.union([z.number().int(), z.string()]).optional(),
    MoodMatch: z.string().optional(),
    Type: z.string().optional(),
  })
  .transform((i) => ({
    title: i["Movie title"],
    year:
      typeof i.Year === "number"
        ? i.Year
        : typeof i.Year === "string" && i.Year.trim() !== ""
        ? Number(i.Year)
        : undefined,
    moodMatch: i.MoodMatch ?? "",
    type: (i.Type ?? "movie").toLowerCase() === "series" ? "series" : "movie",
  }));

// Accept lowercase variant with `moodmatch` as well.
const LowerItem = z
  .object({
    title: z.string(),
    year: z.union([z.number().int(), z.string()]).optional(),
    moodmatch: z.string().optional(),
    type: z.string().optional(),
  })
  .transform((i) => ({
    title: i.title,
    year:
      typeof i.year === "number"
        ? i.year
        : typeof i.year === "string" && i.year.trim() !== ""
        ? Number(i.year)
        : undefined,
    moodMatch: i.moodmatch ?? "",
    type: (i.type ?? "movie").toLowerCase() === "series" ? "series" : "movie",
  }));

const RecommendationSchema = z.object({
  recommendations: z.array(
    z.union([NormalizedItem, WebhookCapsItem, LowerItem])
  ),
});

export type WebhookRecommendation = z.infer<
  typeof RecommendationSchema
>["recommendations"][number];

export class N8NClient {
  constructor(private webhookUrl: string) {}

  async generateRecommendations(params: {
    mood: string;
    genres: string[];
    contentType: "movie" | "series" | "both";
    timeAvailable?: string;
  }): Promise<WebhookRecommendation[]> {
    const res = await fetch(this.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `n8n webhook error: ${res.status} ${res.statusText} ${text?.slice(
          0,
          300
        )}`
      );
    }
    const text = await res.text();

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        json = JSON.parse(match[0]);
      } else {
        throw new Error("n8n webhook did not return JSON");
      }
    }

    // n8n sometimes wraps data as an array of items, each having `json` or an `output` string
    // that itself contains JSON (sometimes with markdown code fences). Unwrap it here.
    let candidate: unknown = json;
    if (Array.isArray(json)) {
      const first = json.find((it: any) => it && typeof it === "object");
      if (first && typeof first === "object") {
        const anyFirst: any = first as any;
        if (anyFirst.json && typeof anyFirst.json === "object") {
          candidate = anyFirst.json;
        } else if (typeof anyFirst.output === "string") {
          const raw = anyFirst.output as string;
          // strip ```json fences and extract JSON block
          const cleaned = raw.replace(/^```json\s*|```$/g, "");
          const match = cleaned.match(/\{[\s\S]*\}/);
          if (!match)
            throw new Error("n8n array item had no parsable JSON in 'output'");
          candidate = JSON.parse(match[0]);
        }
      }
    }

    const parsed = RecommendationSchema.safeParse(candidate);
    if (!parsed.success) {
      throw new Error("Failed to parse recommendations from n8n webhook");
    }
    return parsed.data.recommendations;
  }
}
