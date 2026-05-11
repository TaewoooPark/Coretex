"use client";

import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArchiveGenealogy } from "./ArchiveGenealogy";
import { ArchiveOverview } from "./ArchiveOverview";
import { DecisionTimeline } from "./DecisionTimeline";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import type { ProjectArchiveContent } from "@/lib/archive";
import type { ApiResponse } from "@/types/api";

const queryClient = new QueryClient();

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.ok) throw new Error(payload.error.message);
  return payload.data;
}

export function ArchivePageClient({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ArchiveInner workspaceId={workspaceId} projectId={projectId} />
    </QueryClientProvider>
  );
}

function ArchiveInner({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  const queryClient = useQueryClient();
  const archives = useQuery({
    queryKey: ["archive", projectId],
    queryFn: () => fetchJson<{ archives: any[] }>(`/api/projects/${projectId}/archive`)
  });
  const createArchive = useMutation({
    mutationFn: () => fetchJson(`/api/projects/${projectId}/archive`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["archive", projectId] })
  });
  const latest = archives.data?.archives?.[0];
  const content = latest?.content as ProjectArchiveContent | undefined;
  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-4">
      <header className="mb-4 flex items-center justify-between border-4 border-black bg-white p-4 shadow-hardMd">
        <div>
          <Link href={`/app/w/${workspaceId}/p/${projectId}/flow`} className="text-[11px] uppercase underline">
            Back to flow
          </Link>
          <h1 className="mt-1 text-2xl uppercase">Project Archive</h1>
        </div>
        <BrutalButton variant="inverse" onClick={() => createArchive.mutate()}>
          Generate Archive
        </BrutalButton>
      </header>
      {!content ? (
        <div className="border-4 border-black bg-white p-6 text-sm uppercase">No archive yet. Generate one from the current project graph.</div>
      ) : (
        <div className="space-y-4">
          <ArchiveOverview content={content} />
          <DecisionTimeline decisions={content.decisionTimeline} />
          <ArchiveGenealogy nodes={content.nodeGenealogy} />
          <section className="grid gap-4 md:grid-cols-2">
            <Panel title="Final Outputs" items={content.finalOutputs.map((item) => `${item.title} / v.${item.versionNo}`)} />
            <Panel title="Discarded Alternatives" items={content.discardedAlternatives.map((item) => item.title)} empty="No discarded alternatives" />
            <Panel title="Key Messages" items={content.keyMessages.map((item) => item.content)} />
            <Panel title="Major Tags" items={Array.from(new Set(content.nodeGenealogy.flatMap((item) => item.tags))).map((tag) => `#${tag}`)} />
            <Panel title="Source Files" items={content.sourceFiles.map((item) => `${item.path} -> ${item.importedNodeId ?? "unlinked"}`)} empty="No imported source files" />
          </section>
        </div>
      )}
    </div>
  );
}

function Panel({ title, items, empty = "None" }: { title: string; items: string[]; empty?: string }) {
  return (
    <section className="border-4 border-black bg-white">
      <header className="border-b-4 border-black px-4 py-3 text-sm uppercase">{title}</header>
      <div className="divide-y-2 divide-black">
        {items.length ? items.map((item, index) => <div key={`${item}-${index}`} className="p-3 text-sm leading-5">{item}</div>) : <div className="p-3 text-xs uppercase text-[var(--color-muted)]">{empty}</div>}
      </div>
    </section>
  );
}
