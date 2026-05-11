"use client";

import { MessageCard } from "./MessageCard";
import { MessageComposer } from "./MessageComposer";
import { useMessageMutations, useMessages } from "@/hooks/useMessages";

export function ChatLayer({ projectId, nodeId, readOnly }: { projectId: string; nodeId?: string; readOnly?: boolean }) {
  const messages = useMessages(projectId, nodeId);
  const mutations = useMessageMutations(projectId, nodeId);
  return (
    <div className="space-y-3 p-3">
      <MessageComposer disabled={readOnly} onSubmit={(content) => mutations.createMessage.mutate(content)} />
      {mutations.createMessage.error ? <div className="border-2 border-black bg-white p-2 text-xs uppercase">{mutations.createMessage.error.message}</div> : null}
      <div className="space-y-3">
        {messages.data?.messages?.length ? (
          messages.data.messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              activeNodeId={nodeId}
              onLink={!readOnly ? (messageId) => nodeId && mutations.linkMessage.mutate({ messageId, targetNodeId: nodeId, reason: "Manual node chat link" }) : undefined}
              onCreateNode={!readOnly ? (messageId) => mutations.createNodeFromMessage.mutate({ messageId, parentNodeId: nodeId }) : undefined}
            />
          ))
        ) : (
          <div className="border-2 border-black bg-white p-3 text-xs uppercase text-[var(--color-muted)]">No messages yet</div>
        )}
      </div>
      {mutations.createNodeFromMessage.error ? <div className="border-2 border-black bg-white p-2 text-xs uppercase">{mutations.createNodeFromMessage.error.message}</div> : null}
    </div>
  );
}
