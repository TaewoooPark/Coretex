import type { NextRequest } from "next/server";
import { json } from "@/lib/http";
import { getGraph } from "@/lib/services";
import type { NodeStatus, NodeType } from "@/types/node";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ projectId: string }> }) {
  const params = await context.params;
  const search = request.nextUrl.searchParams;
  return json(
    getGraph(params.projectId, {
      at: search.get("at") ?? undefined,
      tag: search.get("tag") ?? undefined,
      type: (search.get("type") as NodeType | null) ?? undefined,
      status: (search.get("status") as NodeStatus | null) ?? undefined,
      depth: search.get("depth") ? Number(search.get("depth")) : undefined,
      focusNodeId: search.get("focusNodeId") ?? undefined
    })
  );
}
