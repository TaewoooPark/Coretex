"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalInput } from "@/components/brutal/BrutalInput";

export function WorkspaceCreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="mb-6 grid gap-2 border-4 border-black bg-white p-4 shadow-hardSm md:grid-cols-[1fr_1fr_auto]"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        const response = await fetch("/api/workspaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, slug })
        });
        const payload = await response.json();
        if (!payload.ok) {
          setError(payload.error.message);
          return;
        }
        router.push(`/app/w/${payload.data.workspace.id}`);
      }}
    >
      <BrutalInput value={name} onChange={(event) => setName(event.target.value)} placeholder="Workspace name" />
      <BrutalInput value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="workspace-slug" />
      <BrutalButton variant="inverse" type="submit">Create Workspace</BrutalButton>
      {error ? <div className="md:col-span-3 text-xs uppercase">{error}</div> : null}
    </form>
  );
}
