import { updateNodeSchema } from "@/lib/validators";
import { json, readJson } from "@/lib/http";
import { deleteNode, updateNode } from "@/lib/services";
import { fail } from "@/types/api";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ nodeId: string }> }) {
  const params = await context.params;
  const parsed = updateNodeSchema.safeParse(await readJson<unknown>(request));
  if (!parsed.success) {
    return json(fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid node update payload."));
  }
  return json(updateNode(params.nodeId, parsed.data));
}

export async function DELETE(_: Request, context: { params: Promise<{ nodeId: string }> }) {
  const params = await context.params;
  return json(deleteNode(params.nodeId));
}
