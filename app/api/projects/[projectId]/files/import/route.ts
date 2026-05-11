import { json, readJson } from "@/lib/http";
import { importProjectFileSchema } from "@/lib/validators";
import { importProjectFile } from "@/lib/services";
import { fail } from "@/types/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const body = await readJson<unknown>(request);
  const parsed = importProjectFileSchema.safeParse(body);
  if (!parsed.success) {
    return json(fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid file import payload."));
  }
  return json(await importProjectFile(params.projectId, parsed.data), { status: 201 });
}
