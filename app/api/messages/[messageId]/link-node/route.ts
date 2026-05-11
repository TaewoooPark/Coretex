import { linkMessageSchema } from "@/lib/validators";
import { json, readJson } from "@/lib/http";
import { linkMessageToNode } from "@/lib/services";
import { fail } from "@/types/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ messageId: string }> }) {
  const params = await context.params;
  const parsed = linkMessageSchema.safeParse(await readJson<unknown>(request));
  if (!parsed.success) {
    return json(fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid message link payload."));
  }
  return json(linkMessageToNode(params.messageId, parsed.data), { status: 201 });
}
