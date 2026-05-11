"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/api";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.ok) throw new Error(payload.error.message);
  return payload.data;
}

export function useMessages(projectId: string, nodeId?: string) {
  const params = new URLSearchParams();
  if (nodeId) params.set("nodeId", nodeId);
  return useQuery({
    queryKey: ["messages", projectId, nodeId],
    queryFn: () => fetchJson<{ messages: any[] }>(`/api/projects/${projectId}/messages?${params.toString()}`)
  });
}

export function useMessageMutations(projectId: string, nodeId?: string) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["messages", projectId] });
    queryClient.invalidateQueries({ queryKey: ["graph", projectId] });
    queryClient.invalidateQueries({ queryKey: ["ai-suggestions", projectId] });
  };
  return {
    createMessage: useMutation({
      mutationFn: (content: string) =>
        fetchJson(`/api/projects/${projectId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, scopeNodeId: nodeId })
        }),
      onSuccess: invalidate
    }),
    linkMessage: useMutation({
      mutationFn: ({ messageId, targetNodeId, reason }: { messageId: string; targetNodeId: string; reason?: string }) =>
        fetchJson(`/api/messages/${messageId}/link-node`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodeId: targetNodeId, reason })
        }),
      onSuccess: invalidate
    })
  };
}
