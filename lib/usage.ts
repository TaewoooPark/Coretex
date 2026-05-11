import type { CoretexDb } from "./mock-db";
import { planLimits } from "@/types/billing";

export function checkNodeLimit(db: CoretexDb, workspaceId: string): { ok: true } | { ok: false; code: string; message: string } {
  const billing = db.billingAccounts.find((account) => account.workspaceId === workspaceId);
  const limit = billing ? billing.nodeLimit : planLimits.FREE.nodeLimit;
  const projectIds = db.projects.filter((project) => project.workspaceId === workspaceId).map((project) => project.id);
  const currentNodeCount = db.nodes.filter((node) => projectIds.includes(node.projectId) && !node.deletedAt).length;
  if (currentNodeCount >= limit) {
    return {
      ok: false,
      code: "PLAN_LIMIT_EXCEEDED",
      message: "This workspace has reached the node limit for the current plan."
    };
  }
  return { ok: true };
}

export function checkProjectLimit(db: CoretexDb, workspaceId: string): { ok: true } | { ok: false; code: string; message: string } {
  const billing = db.billingAccounts.find((account) => account.workspaceId === workspaceId);
  const limit = billing ? planLimits[billing.plan].projectLimit : planLimits.FREE.projectLimit;
  if (limit === null) {
    return { ok: true };
  }
  const currentProjectCount = db.projects.filter((project) => project.workspaceId === workspaceId && project.status !== "ARCHIVED").length;
  if (currentProjectCount >= limit) {
    return {
      ok: false,
      code: "PLAN_LIMIT_EXCEEDED",
      message: "This workspace has reached the project limit for the current plan."
    };
  }
  return { ok: true };
}
