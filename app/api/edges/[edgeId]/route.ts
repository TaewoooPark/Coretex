import { json } from "@/lib/http";
import { deleteEdge } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function DELETE(_: Request, context: { params: Promise<{ edgeId: string }> }) {
  const params = await context.params;
  return json(deleteEdge(params.edgeId));
}
