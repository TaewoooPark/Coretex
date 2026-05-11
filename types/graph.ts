import type { EdgeType, NodeStatus, NodeType } from "./node";

export type GraphNodeDTO = {
  id: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
  summary?: string;
  position: {
    x: number;
    y: number;
  };
  currentVersionNo: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  tags: string[];
  content?: Record<string, unknown>;
  plainText?: string;
};

export type GraphEdgeDTO = {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: EdgeType;
  label?: string;
  createdAt: string;
  deletedAt?: string;
};

export type GraphResponse = {
  project: {
    id: string;
    name: string;
  };
  nodes: GraphNodeDTO[];
  edges: GraphEdgeDTO[];
  timeRange: {
    start: string;
    end: string;
  };
};
