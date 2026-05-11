import { json } from "@/lib/http";
import { listProjectFiles } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  return json(await listProjectFiles(params.projectId));
}
