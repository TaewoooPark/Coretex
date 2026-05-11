import { json } from "@/lib/http";
import { createArchive, listArchives } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  return json(listArchives(params.projectId));
}

export async function POST(_: Request, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  return json(createArchive(params.projectId), { status: 201 });
}
