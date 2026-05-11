"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/api";

export function useSearch(projectId: string, query: string) {
  return useQuery({
    queryKey: ["search", projectId, query],
    enabled: query.trim().length > 0,
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/search?q=${encodeURIComponent(query)}`);
      const payload = (await response.json()) as ApiResponse<{ results: any[] }>;
      if (!payload.ok) throw new Error(payload.error.message);
      return payload.data.results;
    }
  });
}
