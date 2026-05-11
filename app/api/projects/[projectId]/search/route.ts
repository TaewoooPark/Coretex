import type { NextRequest } from "next/server";
import { json } from "@/lib/http";
import { searchProject } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  return json(searchProject(params.projectId, request.nextUrl.searchParams.get("q") ?? ""));
}
