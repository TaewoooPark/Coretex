import type { NextRequest } from "next/server";
import { createMessageSchema } from "@/lib/validators";
import { json, readJson } from "@/lib/http";
import { createMessage, listMessages } from "@/lib/services";
import { fail } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const search = request.nextUrl.searchParams;
  return json(
    listMessages(params.projectId, {
      nodeId: search.get("nodeId") ?? undefined,
      before: search.get("before") ?? undefined,
      limit: search.get("limit") ? Number(search.get("limit")) : undefined
    })
  );
}

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const parsed = createMessageSchema.safeParse(await readJson<unknown>(request));
  if (!parsed.success) {
    return json(fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid message payload."));
  }
  return json(await createMessage(params.projectId, parsed.data), { status: 201 });
}
