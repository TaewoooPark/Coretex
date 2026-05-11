import Link from "next/link";
import { listProjects } from "@/lib/services";

export default async function WorkspaceDashboard({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = await params;
  const response = listProjects(resolvedParams.workspaceId);
  const projects = response.ok ? response.data.projects : [];
  return (
    <main className="min-h-screen p-6">
      <header className="mb-6 flex items-center justify-between border-4 border-black bg-white p-5 shadow-hardMd">
        <div>
          <div className="text-[11px] uppercase text-[var(--color-muted)]">Workspace</div>
          <h1 className="text-3xl uppercase">{resolvedParams.workspaceId}</h1>
        </div>
        <Link className="border-2 border-black bg-black px-4 py-3 text-xs uppercase text-white shadow-hardSm" href={`/app/w/${resolvedParams.workspaceId}/projects`}>
          Projects
        </Link>
      </header>
      {projects.length === 0 ? (
        <section className="border-4 border-black bg-white p-6 text-sm uppercase">
          NO PROJECT FLOW FOUND. Create a project to start mapping decisions, drafts, messages, and context into a traceable graph.
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} className="block border-4 border-black bg-white p-5 shadow-hardSm hover:shadow-hardMd" href={`/app/w/${resolvedParams.workspaceId}/p/${project.id}/flow`}>
              <div className="flex items-center justify-between text-[11px] uppercase">
                <span>{project.status}</span>
                <span>{project.nodeCount} nodes</span>
              </div>
              <h2 className="mt-3 text-xl uppercase">{project.name}</h2>
              <p className="mt-2 text-sm leading-5 text-[var(--color-muted)]">{project.description}</p>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
