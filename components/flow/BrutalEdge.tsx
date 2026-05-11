"use client";

import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react";

export function BrutalEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, markerEnd, selected }: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ stroke: "#000", strokeWidth: selected ? 4 : 2 }} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute border border-black bg-white px-1.5 py-1 text-[10px] uppercase shadow-hardSm"
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
