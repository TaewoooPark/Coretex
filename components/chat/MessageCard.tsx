import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalBadge } from "@/components/brutal/BrutalBadge";

export function MessageCard({
  message,
  activeNodeId,
  onLink,
  onCreateNode
}: {
  message: any;
  activeNodeId?: string;
  onLink?: (messageId: string) => void;
  onCreateNode?: (messageId: string) => void;
}) {
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
        <div className="flex flex-wrap gap-2">
          {activeNodeId && !linkedToActive && onLink ? (
            <BrutalButton size="sm" onClick={() => onLink(message.id)}>
              Link To This Node
            </BrutalButton>
          ) : null}
          {onCreateNode ? (
            <BrutalButton size="sm" variant="inverse" onClick={() => onCreateNode(message.id)}>
              Make Node
            </BrutalButton>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
