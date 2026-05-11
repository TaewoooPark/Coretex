"use client";

import { useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type Node,
  type OnNodeDrag,
  MarkerType
} from "@xyflow/react";
import { ReactFlow } from "@xyflow/react";
import { ContextNodeCard } from "./ContextNodeCard";
import { BrutalEdge } from "./BrutalEdge";
import { EdgeCreateDialog } from "./EdgeCreateDialog";
import { useGraphMutations } from "@/hooks/useGraph";
import { useFlowStore } from "@/stores/flowStore";
import type { GraphResponse } from "@/types/graph";
import type { EdgeType } from "@/types/node";

const nodeTypes = { contextNode: ContextNodeCard };
const edgeTypes = { brutalEdge: BrutalEdge };

export function FlowCanvas({ graph, readOnly }: { graph: GraphResponse; readOnly: boolean }) {
  const { activeNodeId, setActiveNode, setSelectedNodes, setInspectorTab } = useFlowStore();
  const mutations = useGraphMutations(graph.project.id);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);

  const nodes: Node[] = useMemo(
    () =>
      graph.nodes.map((node) => ({
        id: node.id,
        type: "contextNode",
        position: node.position,
        data: node,
        selected: node.id === activeNodeId,
        draggable: !readOnly
      })),
    [activeNodeId, graph.nodes, readOnly]
  );

  const edges: Edge[] = useMemo(
    () =>
      graph.edges.map((edge) => ({
        id: edge.id,
        source: edge.fromNodeId,
        target: edge.toNodeId,
        label: edge.type,
        type: "brutalEdge",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#000"
        },
        data: edge
      })),
    [graph.edges]
  );

  const onNodeDragStop: OnNodeDrag = (_, node) => {
    if (readOnly) return;
    mutations.updateNode.mutate({ nodeId: node.id, input: { position: node.position } });
  };

  const createEdge = (type: EdgeType) => {
    if (!pendingConnection?.source || !pendingConnection.target) return;
    mutations.createEdge.mutate({
      fromNodeId: pendingConnection.source,
      toNodeId: pendingConnection.target,
      type
    });
    setPendingConnection(null);
  };

  return (
    <div className="h-full min-h-0 flex-1 border-x-4 border-black">
      <ReactFlow
        className="graph-canvas"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onConnect={(connection) => {
          if (!readOnly) setPendingConnection(connection);
        }}
        onNodeClick={(_, node) => {
          setActiveNode(node.id);
          setSelectedNodes([node.id]);
          setInspectorTab("SUMMARY");
        }}
        onNodeDragStop={onNodeDragStop}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        edgesFocusable={!readOnly}
      >
        <Background color="#000" gap={24} size={1} />
        <Controls />
        <MiniMap pannable zoomable nodeColor={() => "#fff"} maskColor="rgba(0,0,0,0.05)" />
      </ReactFlow>
      <EdgeCreateDialog open={Boolean(pendingConnection)} onClose={() => setPendingConnection(null)} onCreate={createEdge} />
    </div>
  );
}
