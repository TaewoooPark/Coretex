import { createVersionSchema } from "@/lib/validators";
import { json, readJson } from "@/lib/http";
import { createVersion, listVersions, restoreVersion } from "@/lib/services";
import { fail } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ nodeId: string }> }) {
  const params = await context.params;
  return json(listVersions(params.nodeId));
}

export async function POST(request: Request, context: { params: Promise<{ nodeId: string }> }) {
  const params = await context.params;
  const body = await readJson<unknown>(request);
  if (
    typeof body === "object" &&
    body !== null &&
    "restoreVersionNo" in body &&
    typeof (body as { restoreVersionNo?: unknown }).restoreVersionNo === "number"
  ) {
    return json(await restoreVersion(params.nodeId, (body as { restoreVersionNo: number; at?: string }).restoreVersionNo, (body as { at?: string }).at));
  }
  const parsed = createVersionSchema.safeParse(body);
  if (!parsed.success) {
    return json(fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid version payload."));
  }
  return json(await createVersion(params.nodeId, parsed.data), { status: 201 });
}
