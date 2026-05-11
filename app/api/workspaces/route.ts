import { createWorkspaceSchema } from "@/lib/validators";
import { json, readJson } from "@/lib/http";
import { createWorkspace, listWorkspaces } from "@/lib/services";
import { fail } from "@/types/api";

export const dynamic = "force-dynamic";

export function GET() {
  return json(listWorkspaces());
}

export async function POST(request: Request) {
  const parsed = createWorkspaceSchema.safeParse(await readJson<unknown>(request));
  if (!parsed.success) {
    return json(fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid workspace payload."));
  }
  return json(createWorkspace(parsed.data), { status: 201 });
}
