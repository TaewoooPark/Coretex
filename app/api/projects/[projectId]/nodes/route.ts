import { createNodeSchema } from "@/lib/validators";
import { json, readJson } from "@/lib/http";
import { createNode } from "@/lib/services";
import { fail } from "@/types/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const parsed = createNodeSchema.safeParse(await readJson<unknown>(request));
  if (!parsed.success) {
    return json(fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid node payload."));
  }
  return json(await createNode(params.projectId, parsed.data), { status: 201 });
}
