"use client";

import { create } from "zustand";
import type { NodeStatus, NodeType } from "@/types/node";

export type InspectorTab = "SUMMARY" | "DOC" | "CHAT" | "VERSIONS" | "GENEALOGY" | "AI";

type FlowStore = {
  activeProjectId: string | null;
  activeNodeId: string | null;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  mode: "CURRENT" | "TIME_TRAVEL";
  selectedTimestamp: string | null;
  filters: {
    nodeTypes: NodeType[];
    statuses: NodeStatus[];
    tags: string[];
    depth: number | null;
    focusNodeId: string | null;
  };
  inspectorTab: InspectorTab;
  setActiveProject: (id: string | null) => void;
  setActiveNode: (id: string | null) => void;
  setSelectedNodes: (ids: string[]) => void;
  setSelectedEdges: (ids: string[]) => void;
  setMode: (mode: "CURRENT" | "TIME_TRAVEL") => void;
  setSelectedTimestamp: (timestamp: string | null) => void;
  setFilters: (filters: Partial<FlowStore["filters"]>) => void;
  setInspectorTab: (tab: InspectorTab) => void;
};

export const useFlowStore = create<FlowStore>((set) => ({
  activeProjectId: null,
  activeNodeId: null,
  selectedNodeIds: [],
  selectedEdgeIds: [],
  mode: "CURRENT",
  selectedTimestamp: null,
  filters: {
    nodeTypes: [],
    statuses: [],
    tags: [],
    depth: null,
    focusNodeId: null
  },
  inspectorTab: "SUMMARY",
  setActiveProject: (id) => set({ activeProjectId: id }),
  setActiveNode: (id) => set({ activeNodeId: id }),
  setSelectedNodes: (ids) => set({ selectedNodeIds: ids }),
  setSelectedEdges: (ids) => set({ selectedEdgeIds: ids }),
  setMode: (mode) => set({ mode }),
  setSelectedTimestamp: (timestamp) => set({ selectedTimestamp: timestamp }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setInspectorTab: (tab) => set({ inspectorTab: tab })
}));
