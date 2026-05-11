import Link from "next/link";
import { WorkspaceCreateForm } from "@/components/layout/WorkspaceCreateForm";
import { listWorkspaces } from "@/lib/services";

export default function WorkspaceSelectorPage() {
  const response = listWorkspaces();
  const workspaces = response.ok ? response.data.workspaces : [];
  return (
    <main className="min-h-screen p-6">
      <header className="mb-6 border-4 border-black bg-white p-5 shadow-hardMd">
        <h1 className="text-4xl uppercase">CORETEX</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6">
          A non-linear collaboration workspace for traceable context nodes, decision genealogy, document versions, and linked conversations.
        </p>
      </header>
      <WorkspaceCreateForm />
      <section className="grid gap-4 md:grid-cols-2">
        {workspaces.map((workspace) => (
          <Link key={workspace.id} className="block border-4 border-black bg-white p-5 shadow-hardSm hover:shadow-hardMd" href={`/app/w/${workspace.id}`}>
            <div className="text-[11px] uppercase">{workspace.role}</div>
            <h2 className="mt-2 text-xl uppercase">{workspace.name}</h2>
            <p className="mt-2 text-xs uppercase text-[var(--color-muted)]">/{workspace.slug}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
