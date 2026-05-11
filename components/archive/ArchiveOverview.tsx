import type { ProjectArchiveContent } from "@/lib/archive";

export function ArchiveOverview({ content }: { content: ProjectArchiveContent }) {
  return (
    <section className="border-4 border-black bg-white shadow-hardMd">
      <header className="border-b-4 border-black bg-black px-4 py-3 text-white">
        <h2 className="text-lg uppercase">{content.project.name}</h2>
      </header>
      <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-6">
        {Object.entries(content.overview).map(([key, value]) => (
          <div key={key} className="border-b-2 border-r-2 border-black p-4">
            <div className="text-[11px] uppercase text-[var(--color-muted)]">{key}</div>
            <div className="mt-2 text-2xl">{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
