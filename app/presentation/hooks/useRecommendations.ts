"use client";
import { useState } from "react";
import type { ContentType, RecommendationRequest } from "@/app/core/domain/entities/types";
import type { Movie, Series } from "@/app/core/domain/entities/types";

export function useRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<(Movie | Series)[]>([]);

  async function getRecommendations(params: RecommendationRequest) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch");
      const data = await res.json();
      setItems(data.recommendations || []);
      try {
        const history = JSON.parse(localStorage.getItem("rec_history") || "[]");
        history.unshift({ ts: Date.now(), params });
        localStorage.setItem("rec_history", JSON.stringify(history.slice(0, 10)));
      } catch {}
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, items, getRecommendations };
}
