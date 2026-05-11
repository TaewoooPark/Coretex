import Link from "next/link";
import { ProjectCreateForm } from "@/components/layout/ProjectCreateForm";
import { listProjects } from "@/lib/services";

export default async function ProjectsPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = await params;
  const response = listProjects(resolvedParams.workspaceId);
  const projects = response.ok ? response.data.projects : [];
  return (
    <main className="min-h-screen p-6">
      <header className="mb-6 border-4 border-black bg-white p-5 shadow-hardMd">
        <Link className="text-[11px] uppercase underline" href={`/app/w/${resolvedParams.workspaceId}`}>
          Back
        </Link>
        <h1 className="mt-2 text-3xl uppercase">Projects</h1>
      </header>
      <ProjectCreateForm workspaceId={resolvedParams.workspaceId} />
      <div className="divide-y-4 divide-black border-4 border-black bg-white">
        {projects.map((project) => (
          <Link key={project.id} href={`/app/w/${resolvedParams.workspaceId}/p/${project.id}/flow`} className="block p-4 hover:bg-black hover:text-white">
            <div className="text-[11px] uppercase">{project.status}</div>
            <div className="mt-1 text-lg uppercase">{project.name}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
