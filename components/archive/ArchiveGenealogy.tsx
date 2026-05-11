import { BrutalBadge } from "@/components/brutal/BrutalBadge";
import type { ProjectArchiveContent } from "@/lib/archive";

export function ArchiveGenealogy({ nodes }: { nodes: ProjectArchiveContent["nodeGenealogy"] }) {
  return (
    <section className="border-4 border-black bg-white">
      <header className="border-b-4 border-black px-4 py-3 text-sm uppercase">Node Genealogy</header>
      <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
        {nodes.map((node) => (
          <article key={node.nodeId} className="border-2 border-black p-3">
            <div className="flex items-center justify-between">
              <BrutalBadge inverse>{node.type}</BrutalBadge>
              <BrutalBadge>{node.status}</BrutalBadge>
            </div>
            <h3 className="mt-3 text-sm uppercase">{node.title}</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] uppercase">
              <div className="border border-black p-2">Parents: {node.parents.length}</div>
              <div className="border border-black p-2">Children: {node.children.length}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {node.tags.map((tag) => <BrutalBadge key={tag}>#{tag}</BrutalBadge>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
