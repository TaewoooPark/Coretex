import type { NextRequest } from "next/server";
import { extractContextSchema } from "@/lib/validators";
import { json, readJson } from "@/lib/http";
import { extractContextForApi, listAiSuggestions, resolveAiSuggestion } from "@/lib/services";
import { fail } from "@/types/api";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("projectId");
  if (!projectId) {
    return json(fail("VALIDATION_ERROR", "projectId is required."));
  }
  return json(listAiSuggestions(projectId));
}

export async function POST(request: Request) {
  const parsed = extractContextSchema.safeParse(await readJson<unknown>(request));
  if (!parsed.success) {
    return json(fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid extraction payload."));
  }
  return json(await extractContextForApi(parsed.data));
}

export async function PATCH(request: Request) {
  const body = await readJson<{ suggestionId?: string; action?: "ACCEPT" | "REJECT" }>(request);
  if (!body.suggestionId || (body.action !== "ACCEPT" && body.action !== "REJECT")) {
    return json(fail("VALIDATION_ERROR", "suggestionId and action are required."));
  }
  return json(resolveAiSuggestion(body.suggestionId, body.action));
}
