"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/api";
import type { EdgeType } from "@/types/node";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.ok) throw new Error(payload.error.message);
  return payload.data;
}

export type FileLibraryEntry = {
  name: string;
  relativePath: string;
  kind: "FOLDER" | "FILE";
  depth: number;
  sizeBytes?: number;
  updatedAt?: string;
  importable: boolean;
  assetId?: string;
  importedNodeId?: string;
};

export function useProjectFiles(projectId: string) {
  return useQuery({
    queryKey: ["project-files", projectId],
    queryFn: () => fetchJson<{ root: string; files: FileLibraryEntry[] }>(`/api/projects/${projectId}/files`)
  });
}

export function useProjectFileMutations(projectId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["project-files", projectId] });
    queryClient.invalidateQueries({ queryKey: ["graph", projectId] });
    queryClient.invalidateQueries({ queryKey: ["ai-suggestions", projectId] });
  };
  return {
    importFile: useMutation({
      mutationFn: (input: { path: string; parentNodeId?: string; edgeType?: EdgeType }) =>
        fetchJson(`/api/projects/${projectId}/files/import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input)
        }),
      onSuccess: invalidate
    })
  };
}
