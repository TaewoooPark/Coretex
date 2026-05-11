"use client";

import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { useGraphMutations } from "@/hooks/useGraph";
import type { GraphEdgeDTO, GraphNodeDTO } from "@/types/graph";

export function GenealogyTab({ node, nodes, edges, projectId, readOnly }: { node?: GraphNodeDTO; nodes: GraphNodeDTO[]; edges: GraphEdgeDTO[]; projectId: string; readOnly: boolean }) {
  const mutations = useGraphMutations(projectId);
  if (!node) return <div className="p-4 text-xs uppercase text-[var(--color-muted)]">NO NODE SELECTED.</div>;
  const parents = edges.filter((edge) => edge.toNodeId === node.id);
  const children = edges.filter((edge) => edge.fromNodeId === node.id);
  const titleFor = (id: string) => nodes.find((item) => item.id === id)?.title ?? id;
  return (
    <div className="space-y-4 p-4">
      <section>
        <h3 className="mb-2 text-[11px] uppercase">Parents</h3>
        <div className="space-y-2">
          {parents.length ? parents.map((edge) => <EdgeRow key={edge.id} title={titleFor(edge.fromNodeId)} type={edge.type} readOnly={readOnly} onDelete={() => mutations.deleteEdge.mutate(edge.id)} />) : <Empty />}
        </div>
      </section>
      <section>
        <h3 className="mb-2 text-[11px] uppercase">Children</h3>
        <div className="space-y-2">
          {children.length ? children.map((edge) => <EdgeRow key={edge.id} title={titleFor(edge.toNodeId)} type={edge.type} readOnly={readOnly} onDelete={() => mutations.deleteEdge.mutate(edge.id)} />) : <Empty />}
        </div>
      </section>
      <section className="border-2 border-black p-3">
        <h3 className="mb-2 text-[11px] uppercase">Decision Chain</h3>
        <p className="text-xs leading-5 text-[var(--color-muted)]">Trace final outputs by following parent and child edges. Cycles are blocked at the API layer.</p>
      </section>
    </div>
  );
}

function EdgeRow({ title, type, readOnly, onDelete }: { title: string; type: string; readOnly: boolean; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 border-2 border-black bg-white p-2">
      <span className="text-xs">{title}</span>
      <span className="flex items-center gap-2">
        <BrutalBadge>{type}</BrutalBadge>
        <BrutalButton size="sm" disabled={readOnly} onClick={onDelete}>Delete</BrutalButton>
      </span>
    </div>
  );
}

function Empty() {
  return <div className="border-2 border-black bg-white p-2 text-[11px] uppercase text-[var(--color-muted)]">None</div>;
}
