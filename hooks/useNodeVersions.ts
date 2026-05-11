"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/api";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.ok) throw new Error(payload.error.message);
  return payload.data;
}

export function useNodeVersions(nodeId?: string) {
  return useQuery({
    queryKey: ["versions", nodeId],
    queryFn: () => fetchJson<{ versions: any[] }>(`/api/nodes/${nodeId}/versions`),
    enabled: Boolean(nodeId)
  });
}

export function useVersionMutations(nodeId?: string, projectId?: string) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["versions", nodeId] });
    if (projectId) queryClient.invalidateQueries({ queryKey: ["graph", projectId] });
  };
  return {
    saveVersion: useMutation({
      mutationFn: (input: unknown) =>
        fetchJson(`/api/nodes/${nodeId}/versions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        }),
      onSuccess: invalidate
    }),
    restoreVersion: useMutation({
      mutationFn: (input: { restoreVersionNo: number; at?: string }) =>
        fetchJson(`/api/nodes/${nodeId}/versions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        }),
      onSuccess: invalidate
    })
  };
}
