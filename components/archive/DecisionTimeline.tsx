import type { ProjectArchiveContent } from "@/lib/archive";

export function DecisionTimeline({ decisions }: { decisions: ProjectArchiveContent["decisionTimeline"] }) {
  return (
    <section className="border-4 border-black bg-white">
      <header className="border-b-4 border-black px-4 py-3 text-sm uppercase">Decision Timeline</header>
      <div className="divide-y-2 divide-black">
        {decisions.length ? decisions.map((decision) => (
          <article key={`${decision.nodeId}-${decision.decidedAt}`} className="p-4">
            <div className="text-[11px] uppercase text-[var(--color-muted)]">{new Date(decision.decidedAt).toISOString().slice(0, 16).replace("T", " ")}</div>
            <h3 className="mt-1 text-sm uppercase">{decision.title}</h3>
            <p className="mt-2 text-sm leading-5">{decision.decision}</p>
            {decision.rationale ? <p className="mt-2 border-2 border-black p-2 text-xs">{decision.rationale}</p> : null}
          </article>
        )) : <div className="p-4 text-xs uppercase text-[var(--color-muted)]">No decisions</div>}
      </div>
    </section>
  );
}
