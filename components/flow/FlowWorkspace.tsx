"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ChatLayer } from "@/components/chat/ChatLayer";
import { FlowCanvas } from "@/components/flow/FlowCanvas";
import { TimeTravelBar } from "@/components/flow/TimeTravelBar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightInspector } from "@/components/layout/RightInspector";
import { TopBar } from "@/components/layout/TopBar";
import { useGraph } from "@/hooks/useGraph";
import { useFlowStore } from "@/stores/flowStore";

const queryClient = new QueryClient();

export function FlowWorkspace({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <FlowWorkspaceInner workspaceId={workspaceId} projectId={projectId} />
    </QueryClientProvider>
  );
}

function FlowWorkspaceInner({ workspaceId, projectId }: { workspaceId: string; projectId: string }) {
  const { mode, selectedTimestamp, filters, setActiveProject, setMode, setSelectedTimestamp } = useFlowStore();
  const graphQuery = useGraph(projectId, {
    at: selectedTimestamp,
    tag: filters.tags[0] ?? null,
    type: filters.nodeTypes[0] ?? null,
    status: filters.statuses[0] ?? null,
    depth: filters.depth,
    focusNodeId: filters.focusNodeId
  });
  const [showProjectChat, setShowProjectChat] = useState(false);

  useEffect(() => {
    setActiveProject(projectId);
  }, [projectId, setActiveProject]);

  const graph = graphQuery.data;
  const currentDate = useMemo(() => {
    if (selectedTimestamp) return new Date(selectedTimestamp);
    return graph ? new Date(graph.timeRange.end) : new Date();
  }, [graph, selectedTimestamp]);

  if (graphQuery.isLoading) {
    return <div className="flex h-screen items-center justify-center text-xs uppercase">Loading graph</div>;
  }
  if (graphQuery.error || !graph) {
    return <div className="flex h-screen items-center justify-center border-4 border-black p-4 text-xs uppercase">{graphQuery.error?.message ?? "Graph failed"}</div>;
  }

  const readOnly = mode === "TIME_TRAVEL";
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar workspaceId={workspaceId} projectId={projectId} projectName={graph.project.name} />
      <main className="flex min-h-0 flex-1">
        <LeftSidebar projectId={projectId} nodes={graph.nodes} readOnly={readOnly} />
        <FlowCanvas graph={graph} readOnly={readOnly} />
        <RightInspector graph={graph} readOnly={readOnly} />
        {showProjectChat ? (
          <aside className="w-80 border-l-4 border-black bg-[var(--color-surface-alt)]">
            <header className="flex items-center justify-between border-b-4 border-black bg-white p-3 text-xs uppercase">
              Project Chat
              <button onClick={() => setShowProjectChat(false)}>Close</button>
            </header>
            <ChatLayer projectId={projectId} readOnly={readOnly} />
          </aside>
        ) : (
          <button
            className="absolute bottom-20 right-[440px] z-10 border-2 border-black bg-white px-3 py-2 text-xs uppercase shadow-hardMd hover:bg-black hover:text-white"
            onClick={() => setShowProjectChat(true)}
          >
            Project Chat
          </button>
        )}
      </main>
      <TimeTravelBar
        start={new Date(graph.timeRange.start)}
        end={new Date(graph.timeRange.end)}
        current={currentDate}
        mode={mode}
        onChange={(date) => {
          setSelectedTimestamp(date.toISOString());
          setMode("TIME_TRAVEL");
        }}
        onExit={() => {
          setMode("CURRENT");
          setSelectedTimestamp(null);
        }}
      />
    </div>
  );
}
