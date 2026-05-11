"use client";

import { useState } from "react";
import { NodeCreateDialog } from "@/components/flow/NodeCreateDialog";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalInput } from "@/components/brutal/BrutalInput";
import { BrutalSelect } from "@/components/brutal/BrutalSelect";
import { useGraphMutations } from "@/hooks/useGraph";
import { useFlowStore } from "@/stores/flowStore";
import { nodeStatuses, nodeTypes, type NodeStatus, type NodeType } from "@/types/node";
import type { GraphNodeDTO } from "@/types/graph";

export function LeftSidebar({ projectId, nodes, readOnly }: { projectId: string; nodes: GraphNodeDTO[]; readOnly: boolean }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [tag, setTag] = useState("");
  const { filters, setFilters } = useFlowStore();
  const mutations = useGraphMutations(projectId);
  const activeTags = Array.from(new Set(nodes.flatMap((node) => node.tags)));
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r-4 border-black bg-[var(--color-surface-alt)]">
      <div className="border-b-4 border-black p-3">
        <BrutalButton variant="inverse" disabled={readOnly} className="w-full" onClick={() => setCreateOpen(true)}>
          Create Node
        </BrutalButton>
      </div>
      <div className="space-y-4 overflow-auto p-3 brutal-scrollbar">
        <section>
          <h2 className="mb-2 text-[11px] uppercase">Project Nodes</h2>
          <div className="space-y-1">
            {nodes.map((node) => (
              <button
                key={node.id}
                className="block w-full border-2 border-black bg-white p-2 text-left text-xs uppercase hover:bg-black hover:text-white"
                onClick={() => setFilters({ focusNodeId: node.id, depth: 2 })}
              >
                {node.title}
              </button>
            ))}
          </div>
        </section>
        <section className="space-y-2">
          <h2 className="text-[11px] uppercase">Filters</h2>
          <BrutalSelect value={filters.nodeTypes[0] ?? ""} onChange={(event) => setFilters({ nodeTypes: event.target.value ? [event.target.value as NodeType] : [] })}>
            <option value="">All types</option>
            {nodeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </BrutalSelect>
          <BrutalSelect value={filters.statuses[0] ?? ""} onChange={(event) => setFilters({ statuses: event.target.value ? [event.target.value as NodeStatus] : [] })}>
            <option value="">All statuses</option>
            {nodeStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </BrutalSelect>
          <div className="flex gap-2">
            <BrutalInput value={tag} onChange={(event) => setTag(event.target.value)} placeholder="tag" />
            <BrutalButton size="sm" onClick={() => setFilters({ tags: tag ? [tag] : [] })}>
              Apply
            </BrutalButton>
          </div>
          <div className="flex flex-wrap gap-1">
            {activeTags.map((item) => (
              <button key={item} className="border border-black bg-white px-1.5 py-1 text-[11px]" onClick={() => setFilters({ tags: [item] })}>
                #{item}
              </button>
            ))}
          </div>
        </section>
      </div>
      <NodeCreateDialog
        open={createOpen}
        nodes={nodes}
        onClose={() => setCreateOpen(false)}
        onCreate={(input) => {
          mutations.createNode.mutate(input);
          setCreateOpen(false);
        }}
      />
    </aside>
  );
}
