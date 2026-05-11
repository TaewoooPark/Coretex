"use client";

import { useState } from "react";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalDialog } from "@/components/brutal/BrutalDialog";
import { BrutalInput } from "@/components/brutal/BrutalInput";
import { BrutalSelect } from "@/components/brutal/BrutalSelect";
import { BrutalTextarea } from "@/components/brutal/BrutalTextarea";
import { edgeTypes, nodeTypes, type EdgeType, type NodeType } from "@/types/node";
import type { GraphNodeDTO } from "@/types/graph";

export function NodeCreateDialog({
  open,
  nodes,
  onClose,
  onCreate
}: {
  open: boolean;
  nodes: GraphNodeDTO[];
  onClose: () => void;
  onCreate: (input: {
    title: string;
    type: NodeType;
    summary?: string;
    parentNodeId?: string;
    edgeType?: EdgeType;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<NodeType>("IDEA");
  const [summary, setSummary] = useState("");
  const [parentNodeId, setParentNodeId] = useState("");
  const [edgeType, setEdgeType] = useState<EdgeType>("DERIVES_FROM");
  return (
    <BrutalDialog open={open} title="Create Context Node" onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim()) return;
          onCreate({
            title,
            type,
            summary: summary || undefined,
            parentNodeId: parentNodeId || undefined,
            edgeType
          });
          setTitle("");
          setSummary("");
        }}
      >
        <label className="block text-[11px] uppercase">Title</label>
        <BrutalInput value={title} onChange={(event) => setTitle(event.target.value)} />
        <label className="block text-[11px] uppercase">Type</label>
        <BrutalSelect value={type} onChange={(event) => setType(event.target.value as NodeType)}>
          {nodeTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </BrutalSelect>
        <label className="block text-[11px] uppercase">Summary</label>
        <BrutalTextarea value={summary} onChange={(event) => setSummary(event.target.value)} />
        <label className="block text-[11px] uppercase">Parent Node</label>
        <BrutalSelect value={parentNodeId} onChange={(event) => setParentNodeId(event.target.value)}>
          <option value="">None</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.title}
            </option>
          ))}
        </BrutalSelect>
        <label className="block text-[11px] uppercase">Parent Relationship</label>
        <BrutalSelect value={edgeType} onChange={(event) => setEdgeType(event.target.value as EdgeType)}>
          {edgeTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </BrutalSelect>
        <BrutalButton variant="inverse" type="submit">
          Create Node
        </BrutalButton>
      </form>
    </BrutalDialog>
  );
}
