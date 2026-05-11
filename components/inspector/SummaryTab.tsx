"use client";

import { useEffect, useState } from "react";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalInput } from "@/components/brutal/BrutalInput";
import { BrutalSelect } from "@/components/brutal/BrutalSelect";
import { BrutalTextarea } from "@/components/brutal/BrutalTextarea";
import { useGraphMutations } from "@/hooks/useGraph";
import { nodeStatuses, nodeTypes, type NodeStatus, type NodeType } from "@/types/node";
import type { GraphEdgeDTO, GraphNodeDTO } from "@/types/graph";

export function SummaryTab({ node, edges, projectId, readOnly }: { node?: GraphNodeDTO; edges: GraphEdgeDTO[]; projectId: string; readOnly: boolean }) {
  const mutations = useGraphMutations(projectId);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<NodeType>("IDEA");
  const [status, setStatus] = useState<NodeStatus>("RAW");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (!node) return;
    setTitle(node.title);
    setType(node.type);
    setStatus(node.status);
    setSummary(node.summary ?? "");
  }, [node]);

  if (!node) {
    return <div className="p-4 text-xs uppercase text-[var(--color-muted)]">NO NODE SELECTED. Select a node to inspect its document, genealogy, versions, and linked conversations.</div>;
  }
  return (
    <div className="space-y-4 p-4">
      <div>
        <div className="text-[11px] uppercase text-[var(--color-muted)]">Title</div>
        <h2 className="mt-1 text-lg uppercase leading-tight">{node.title}</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <BrutalBadge inverse>{node.type}</BrutalBadge>
        <BrutalBadge>{node.status}</BrutalBadge>
        <BrutalBadge>v.{node.currentVersionNo}</BrutalBadge>
      </div>
      <p className="border-2 border-black bg-white p-3 text-sm leading-5">{node.summary ?? "No summary"}</p>
      <div className="flex flex-wrap gap-1">
        {node.tags.length ? node.tags.map((tag) => <BrutalBadge key={tag}>#{tag}</BrutalBadge>) : <span className="text-xs uppercase text-[var(--color-muted)]">No tags</span>}
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px] uppercase">
        <div className="border-2 border-black p-2">Incoming: {edges.filter((edge) => edge.toNodeId === node.id).length}</div>
        <div className="border-2 border-black p-2">Outgoing: {edges.filter((edge) => edge.fromNodeId === node.id).length}</div>
        <div className="border-2 border-black p-2">Created: {new Date(node.createdAt).toISOString().slice(0, 10)}</div>
        <div className="border-2 border-black p-2">Updated: {new Date(node.updatedAt).toISOString().slice(0, 10)}</div>
      </div>
      <form
        className="space-y-2 border-2 border-black p-3"
        onSubmit={(event) => {
          event.preventDefault();
          mutations.updateNode.mutate({ nodeId: node.id, input: { title, type, status, summary } });
        }}
      >
        <div className="text-[11px] uppercase">Edit Metadata</div>
        <BrutalInput disabled={readOnly} value={title} onChange={(event) => setTitle(event.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <BrutalSelect disabled={readOnly} value={type} onChange={(event) => setType(event.target.value as NodeType)}>
            {nodeTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </BrutalSelect>
          <BrutalSelect disabled={readOnly} value={status} onChange={(event) => setStatus(event.target.value as NodeStatus)}>
            {nodeStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </BrutalSelect>
        </div>
        <BrutalTextarea disabled={readOnly} value={summary} onChange={(event) => setSummary(event.target.value)} />
        <div className="flex gap-2">
          <BrutalButton disabled={readOnly} variant="inverse" size="sm" type="submit">Save Node</BrutalButton>
          <BrutalButton disabled={readOnly} variant="danger" size="sm" type="button" onClick={() => mutations.deleteNode.mutate(node.id)}>Delete Node</BrutalButton>
        </div>
      </form>
    </div>
  );
}
