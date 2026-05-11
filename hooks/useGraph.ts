"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GraphResponse } from "@/types/graph";
import type { ApiResponse } from "@/types/api";
import type { EdgeType, NodeStatus, NodeType } from "@/types/node";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.ok) {
    throw new Error(payload.error.message);
  }
  return payload.data;
}

export function useGraph(
  projectId: string,
  filters: {
    at?: string | null;
    tag?: string | null;
    type?: NodeType | null;
    status?: NodeStatus | null;
    depth?: number | null;
    focusNodeId?: string | null;
  }
) {
  const params = new URLSearchParams();
  if (filters.at) params.set("at", filters.at);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.depth !== null && filters.depth !== undefined) params.set("depth", String(filters.depth));
  if (filters.focusNodeId) params.set("focusNodeId", filters.focusNodeId);
  return useQuery({
    queryKey: ["graph", projectId, filters],
    queryFn: () => fetchJson<GraphResponse>(`/api/projects/${projectId}/graph?${params.toString()}`)
  });
}

export function useGraphMutations(projectId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["graph", projectId] });
  return {
    createNode: useMutation({
      mutationFn: (input: unknown) =>
        fetchJson(`/api/projects/${projectId}/nodes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        }),
      onSuccess: invalidate
    }),
    updateNode: useMutation({
      mutationFn: ({ nodeId, input }: { nodeId: string; input: unknown }) =>
        fetchJson(`/api/nodes/${nodeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        }),
      onSuccess: invalidate
    }),
    createEdge: useMutation({
      mutationFn: (input: { fromNodeId: string; toNodeId: string; type: EdgeType; label?: string }) =>
        fetchJson(`/api/projects/${projectId}/edges`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        }),
      onSuccess: invalidate
    }),
    deleteEdge: useMutation({
      mutationFn: (edgeId: string) => fetchJson(`/api/edges/${edgeId}`, { method: "DELETE" }),
      onSuccess: invalidate
    }),
    deleteNode: useMutation({
      mutationFn: (nodeId: string) => fetchJson(`/api/nodes/${nodeId}`, { method: "DELETE" }),
      onSuccess: invalidate
    })
  };
}
