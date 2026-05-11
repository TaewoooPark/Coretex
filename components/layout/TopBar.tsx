"use client";

import Link from "next/link";
import { BrutalCommandMenu } from "@/components/brutal/BrutalCommandMenu";
import { useFlowStore } from "@/stores/flowStore";

export function TopBar({ workspaceId, projectId, projectName }: { workspaceId: string; projectId: string; projectName: string }) {
  const { setActiveNode, setFilters, setInspectorTab } = useFlowStore();
  return (
    <header className="flex h-16 items-center justify-between border-b-4 border-black bg-white px-4">
      <div className="min-w-0">
        <Link className="text-[11px] uppercase text-[var(--color-muted)] underline" href={`/app/w/${workspaceId}`}>
          Workspace / {workspaceId}
        </Link>
        <h1 className="truncate text-lg uppercase">{projectName}</h1>
      </div>
      <div className="flex items-center gap-2">
        <BrutalCommandMenu
          projectId={projectId}
          onResult={(result) => {
            if (result.type === "NODE") {
              setActiveNode(result.id);
              setFilters({ focusNodeId: result.id, depth: 2 });
              setInspectorTab("SUMMARY");
            }
            if (result.type === "TAG") {
              setFilters({ tags: [result.title.replace(/^#/, "")] });
            }
            if (result.type === "MESSAGE") {
              setInspectorTab("CHAT");
            }
          }}
        />
        <Link className="border-2 border-black bg-white px-3 py-2 text-xs uppercase shadow-hardSm hover:bg-black hover:text-white" href={`/app/w/${workspaceId}/p/${projectId}/archive`}>
          Archive
        </Link>
        <form action="/api/auth/sign-out" method="post">
          <button className="border-2 border-black bg-white px-3 py-2 text-xs uppercase shadow-hardSm hover:bg-black hover:text-white" type="submit">
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
