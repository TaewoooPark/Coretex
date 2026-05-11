"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import type { GraphNodeDTO } from "@/types/graph";

const statusClass: Record<string, string> = {
  RAW: "border-dotted",
  IN_PROGRESS: "border-solid",
  REVIEW: "border-double",
  DECIDED: "border-l-8",
  DISCARDED: "hatch opacity-75",
  FINALIZED: "border-4"
};

export function ContextNodeCard({ data, selected }: NodeProps) {
  const node = data as unknown as GraphNodeDTO;
  const finalized = node.status === "FINALIZED";
  return (
    <article
      className={[
        "w-72 bg-white text-black shadow-hardSm",
        selected ? "border-4 border-black shadow-hardMd" : "border-2 border-black",
        statusClass[node.status] ?? "",
        node.status === "DISCARDED" ? "relative" : ""
      ].join(" ")}
    >
      <Handle type="target" position={Position.Left} />
      <header className={["flex items-center justify-between border-b-2 border-black px-3 py-2", finalized ? "bg-black text-white" : "bg-[var(--color-surface-alt)]"].join(" ")}>
        <span className="text-[11px] uppercase">{node.type}</span>
        <span className="text-[11px]">v.{String(node.currentVersionNo).padStart(2, "0")}</span>
      </header>
      <div className="min-h-28 px-3 py-3">
        <h3 className="text-sm uppercase leading-snug">{node.title}</h3>
        {node.summary ? <p className="mt-3 line-clamp-3 text-xs leading-5 text-[var(--color-muted)]">{node.summary}</p> : null}
      </div>
      <div className="flex min-h-9 flex-wrap gap-1 border-t-2 border-black px-3 py-2">
        {node.tags.length > 0 ? node.tags.map((tag) => <BrutalBadge key={tag}>#{tag}</BrutalBadge>) : <span className="text-[11px] uppercase text-[var(--color-muted)]">No tags</span>}
      </div>
      <footer className="border-t-2 border-black px-3 py-2 text-[11px] uppercase">Status: {node.status}</footer>
      <Handle type="source" position={Position.Right} />
    </article>
  );
}
