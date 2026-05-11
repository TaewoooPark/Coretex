import { json, readJson } from "@/lib/http";
import { createNodeFromMessage } from "@/lib/services";
import { createNodeFromMessageSchema } from "@/lib/validators";
import { fail } from "@/types/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ messageId: string }> }) {
  const params = await context.params;
  const body = await readJson<unknown>(request);
  const parsed = createNodeFromMessageSchema.safeParse(body);
  if (!parsed.success) {
    return json(fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid message-to-node payload."));
  }
  return json(await createNodeFromMessage(params.messageId, parsed.data), { status: 201 });
}
