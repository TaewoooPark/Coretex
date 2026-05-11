import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";

export function json<T>(response: ApiResponse<T>, init?: ResponseInit) {
  const status = response.ok ? init?.status ?? 200 : statusForCode(response.error.code);
  return NextResponse.json(response, { ...init, status });
}

export async function readJson<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

function statusForCode(code: string): number {
  if (code === "FORBIDDEN") return 403;
  if (code === "PLAN_LIMIT_EXCEEDED") return 403;
  if (code.endsWith("_NOT_FOUND")) return 404;
  if (code === "SLUG_TAKEN" || code === "EDGE_DUPLICATED" || code === "CYCLE_NOT_ALLOWED") return 409;
  if (code === "VALIDATION_ERROR") return 400;
  return 400;
}
