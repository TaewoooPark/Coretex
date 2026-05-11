import { BrutalBadge } from "@/components/brutal/BrutalBadge";

import { BrutalButton } from "@/components/brutal/BrutalButton";

export function MessageCard({ message, activeNodeId, onLink }: { message: any; activeNodeId?: string; onLink?: (messageId: string) => void }) {
  const linkedToActive = activeNodeId ? message.linkedNodes?.some((link: any) => link.nodeId === activeNodeId) : true;
  return (
    <article className="border-2 border-black bg-white">
      <header className="border-b-2 border-black bg-[var(--color-surface-alt)] px-3 py-2 text-[11px] uppercase">
        {message.author?.name ?? "User"} / {new Date(message.createdAt).toISOString().slice(0, 16).replace("T", " ")}
      </header>
      <div className="px-3 py-3 text-sm leading-5">{message.content}</div>
      <footer className="space-y-2 border-t-2 border-black px-3 py-2">
        <div className="flex flex-wrap gap-1">
          <span className="text-[11px] uppercase">Linked:</span>
          {message.linkedNodes?.length ? (
            message.linkedNodes.map((link: any) => (
              <BrutalBadge key={`${message.id}-${link.nodeId}`}>{link.node?.title ?? link.nodeId}</BrutalBadge>
            ))
          ) : (
            <span className="text-[11px] uppercase text-[var(--color-muted)]">None</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="text-[11px] uppercase">Tags:</span>
          {message.tags?.length ? message.tags.map((tag: string) => <BrutalBadge key={tag}>#{tag}</BrutalBadge>) : <span className="text-[11px] uppercase text-[var(--color-muted)]">None</span>}
        </div>
        {activeNodeId && !linkedToActive && onLink ? (
          <BrutalButton size="sm" onClick={() => onLink(message.id)}>
            Link To This Node
          </BrutalButton>
        ) : null}
      </footer>
    </article>
  );
}
