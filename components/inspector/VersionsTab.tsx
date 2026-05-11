"use client";

import { useState } from "react";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { useNodeVersions, useVersionMutations } from "@/hooks/useNodeVersions";
import type { GraphNodeDTO } from "@/types/graph";

export function VersionsTab({ node, projectId, readOnly, selectedTimestamp }: { node?: GraphNodeDTO; projectId: string; readOnly: boolean; selectedTimestamp?: string | null }) {
  const versions = useNodeVersions(node?.id);
  const mutations = useVersionMutations(node?.id, projectId);
  const [preview, setPreview] = useState<any | null>(null);
  if (!node) return <div className="p-4 text-xs uppercase text-[var(--color-muted)]">NO NODE SELECTED.</div>;
  return (
    <div className="space-y-3 p-4">
      {preview ? (
        <div className="border-2 border-black bg-white p-3">
          <div className="text-[11px] uppercase">Preview v.{preview.versionNo}</div>
          <pre className="mt-2 whitespace-pre-wrap text-xs">{preview.plainText ?? JSON.stringify(preview.content, null, 2)}</pre>
        </div>
      ) : null}
      {versions.data?.versions?.map((version: any) => (
        <article key={version.id} className="border-2 border-black bg-white">
          <header className="flex items-center justify-between border-b-2 border-black px-3 py-2 text-[11px] uppercase">
            <span>v.{String(version.versionNo).padStart(2, "0")}</span>
            <span>{new Date(version.createdAt).toISOString().slice(0, 16).replace("T", " ")}</span>
          </header>
          <div className="space-y-2 p-3">
            <div className="text-sm">{version.title}</div>
            <div className="text-xs text-[var(--color-muted)]">{version.changeSummary}</div>
            <div className="flex gap-2">
              <BrutalButton size="sm" onClick={() => setPreview(version)}>
                Open
              </BrutalButton>
              <BrutalButton
                size="sm"
                variant="inverse"
                disabled={readOnly}
                onClick={() => mutations.restoreVersion.mutate({ restoreVersionNo: version.versionNo, at: selectedTimestamp ?? undefined })}
              >
                Restore
              </BrutalButton>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
