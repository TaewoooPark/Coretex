"use client";

import { ChatLayer } from "@/components/chat/ChatLayer";

export function ChatTab({ projectId, nodeId, readOnly }: { projectId: string; nodeId?: string; readOnly?: boolean }) {
  if (!nodeId) return <div className="p-4 text-xs uppercase text-[var(--color-muted)]">NO NODE SELECTED.</div>;
  return <ChatLayer projectId={projectId} nodeId={nodeId} readOnly={readOnly} />;
}
