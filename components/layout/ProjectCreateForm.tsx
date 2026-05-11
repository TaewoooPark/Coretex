"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalInput } from "@/components/brutal/BrutalInput";
import { BrutalTextarea } from "@/components/brutal/BrutalTextarea";

export function ProjectCreateForm({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="mb-6 grid gap-2 border-4 border-black bg-white p-4 shadow-hardSm"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        const response = await fetch(`/api/workspaces/${workspaceId}/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description: description || undefined })
        });
        const payload = await response.json();
        if (!payload.ok) {
          setError(payload.error.message);
          return;
        }
        router.push(`/app/w/${workspaceId}/p/${payload.data.project.id}/flow`);
      }}
    >
      <div className="text-[11px] uppercase">Create Project</div>
      <BrutalInput value={name} onChange={(event) => setName(event.target.value)} placeholder="Project name" />
      <BrutalTextarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Project description" />
      <BrutalButton variant="inverse" type="submit">Create Project</BrutalButton>
      {error ? <div className="text-xs uppercase">{error}</div> : null}
    </form>
  );
}
