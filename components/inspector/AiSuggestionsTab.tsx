"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import type { ApiResponse } from "@/types/api";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.ok) throw new Error(payload.error.message);
  return payload.data;
}

export function AiSuggestionsTab({ projectId, readOnly }: { projectId: string; readOnly: boolean }) {
  const queryClient = useQueryClient();
  const suggestions = useQuery({
    queryKey: ["ai-suggestions", projectId],
    queryFn: () => fetchJson<{ suggestions: any[] }>(`/api/ai/extract-context?projectId=${projectId}`)
  });
  const resolve = useMutation({
    mutationFn: (input: { suggestionId: string; action: "ACCEPT" | "REJECT" }) =>
      fetchJson(`/api/ai/extract-context`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-suggestions", projectId] });
      queryClient.invalidateQueries({ queryKey: ["graph", projectId] });
      queryClient.invalidateQueries({ queryKey: ["messages", projectId] });
    }
  });
  const pending = suggestions.data?.suggestions?.filter((item) => item.status === "PENDING") ?? [];
  return (
    <div className="space-y-3 p-4">
      {pending.length === 0 ? (
        <div className="border-2 border-black bg-white p-3 text-xs uppercase text-[var(--color-muted)]">
          NO AI SUGGESTIONS. CORETEX will surface semantic tags, node links, and decision candidates as conversations accumulate.
        </div>
      ) : (
        pending.map((suggestion) => (
          <article key={suggestion.id} className="border-2 border-black bg-white">
            <header className="flex items-center justify-between border-b-2 border-black px-3 py-2 text-[11px] uppercase">
              <BrutalBadge inverse>{suggestion.kind}</BrutalBadge>
              <span>{Math.round(suggestion.confidence * 100)}%</span>
            </header>
            <pre className="whitespace-pre-wrap p-3 text-xs">{JSON.stringify(suggestion.payload, null, 2)}</pre>
            <footer className="flex gap-2 border-t-2 border-black p-3">
              <BrutalButton size="sm" variant="inverse" disabled={readOnly} onClick={() => resolve.mutate({ suggestionId: suggestion.id, action: "ACCEPT" })}>
                Accept
              </BrutalButton>
              <BrutalButton size="sm" disabled={readOnly} onClick={() => resolve.mutate({ suggestionId: suggestion.id, action: "REJECT" })}>
                Reject
              </BrutalButton>
            </footer>
          </article>
        ))
      )}
    </div>
  );
}
