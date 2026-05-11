import { createProjectSchema } from "@/lib/validators";
import { json, readJson } from "@/lib/http";
import { createProject, listProjects } from "@/lib/services";
import { fail } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ workspaceId: string }> }) {
  const params = await context.params;
  return json(listProjects(params.workspaceId));
}

export async function POST(request: Request, context: { params: Promise<{ workspaceId: string }> }) {
  const params = await context.params;
  const parsed = createProjectSchema.safeParse(await readJson<unknown>(request));
  if (!parsed.success) {
    return json(fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid project payload."));
  }
  return json(createProject(params.workspaceId, parsed.data), { status: 201 });
}
