"use client";

import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { useProjectFileMutations, useProjectFiles } from "@/hooks/useProjectFiles";
import { useFlowStore } from "@/stores/flowStore";

export function FileLibraryPanel({ projectId, readOnly }: { projectId: string; readOnly: boolean }) {
  const { activeNodeId, setActiveNode, setFilters, setInspectorTab } = useFlowStore();
  const files = useProjectFiles(projectId);
  const mutations = useProjectFileMutations(projectId);
  const entries = files.data?.files ?? [];

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[11px] uppercase">Local Files</h2>
        {activeNodeId ? <BrutalBadge>Link imports</BrutalBadge> : null}
      </div>
      {files.isLoading ? <div className="border-2 border-black bg-white p-2 text-[11px] uppercase">Scanning</div> : null}
      {files.error ? <div className="border-2 border-black bg-white p-2 text-[11px] uppercase">{files.error.message}</div> : null}
      {!files.isLoading && entries.length === 0 ? (
        <div className="border-2 border-black bg-white p-2 text-[11px] uppercase text-[var(--color-muted)]">
          No local files in data/local-library/{projectId}
        </div>
      ) : null}
      <div className="max-h-64 overflow-auto brutal-scrollbar border-2 border-black bg-white">
        {entries.map((entry) => {
          const imported = Boolean(entry.importedNodeId);
          return (
            <div key={entry.relativePath} className="border-b border-black p-2" style={{ paddingLeft: `${8 + entry.depth * 12}px` }}>
              <div className="flex items-start justify-between gap-2">
                <button
                  className="min-w-0 text-left text-[11px] uppercase underline-offset-2 hover:underline"
                  disabled={!entry.importedNodeId}
                  onClick={() => {
                    if (!entry.importedNodeId) return;
                    setActiveNode(entry.importedNodeId);
                    setFilters({ focusNodeId: entry.importedNodeId, depth: 1 });
                    setInspectorTab("SUMMARY");
                  }}
                >
                  <span className="block truncate">{entry.name}</span>
                  <span className="block truncate text-[var(--color-muted)]">{entry.kind}</span>
                </button>
                {entry.kind === "FILE" ? (
                  <BrutalButton
                    size="sm"
                    disabled={readOnly || !entry.importable || imported || mutations.importFile.isPending}
                    onClick={() =>
                      mutations.importFile.mutate({
                        path: entry.relativePath,
                        parentNodeId: activeNodeId ?? undefined,
                        edgeType: "REFERENCES"
                      })
                    }
                  >
                    {imported ? "Imported" : "Import"}
                  </BrutalButton>
                ) : (
                  <BrutalBadge>Folder</BrutalBadge>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {mutations.importFile.error ? <div className="border-2 border-black bg-white p-2 text-[11px] uppercase">{mutations.importFile.error.message}</div> : null}
    </section>
  );
}
