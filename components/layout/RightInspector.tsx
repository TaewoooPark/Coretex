"use client";

import { AiSuggestionsTab } from "@/components/inspector/AiSuggestionsTab";
import { ChatTab } from "@/components/inspector/ChatTab";
import { DocumentTab } from "@/components/inspector/DocumentTab";
import { GenealogyTab } from "@/components/inspector/GenealogyTab";
import { SummaryTab } from "@/components/inspector/SummaryTab";
import { VersionsTab } from "@/components/inspector/VersionsTab";
import { BrutalTabs } from "@/components/brutal/BrutalTabs";
import { useFlowStore, type InspectorTab } from "@/stores/flowStore";
import type { GraphResponse } from "@/types/graph";

export function RightInspector({ graph, readOnly }: { graph: GraphResponse; readOnly: boolean }) {
  const { activeNodeId, inspectorTab, setInspectorTab, selectedTimestamp } = useFlowStore();
  const node = graph.nodes.find((item) => item.id === activeNodeId);
  const tabs: { id: InspectorTab; label: string; content: React.ReactNode }[] = [
    { id: "SUMMARY", label: "Summary", content: <SummaryTab node={node} edges={graph.edges} projectId={graph.project.id} readOnly={readOnly} /> },
    { id: "DOC", label: "Doc", content: <DocumentTab node={node} projectId={graph.project.id} readOnly={readOnly} /> },
    { id: "CHAT", label: "Chat", content: <ChatTab projectId={graph.project.id} nodeId={node?.id} readOnly={readOnly} /> },
    { id: "VERSIONS", label: "Versions", content: <VersionsTab node={node} projectId={graph.project.id} readOnly={readOnly} selectedTimestamp={selectedTimestamp} /> },
    { id: "GENEALOGY", label: "Genealogy", content: <GenealogyTab node={node} nodes={graph.nodes} edges={graph.edges} projectId={graph.project.id} readOnly={readOnly} /> },
    { id: "AI", label: "AI", content: <AiSuggestionsTab projectId={graph.project.id} readOnly={readOnly} /> }
  ];
  return (
    <aside className="flex w-[420px] shrink-0 flex-col bg-[var(--color-surface-alt)]">
      <BrutalTabs tabs={tabs} active={inspectorTab} onChange={setInspectorTab} />
    </aside>
  );
}
