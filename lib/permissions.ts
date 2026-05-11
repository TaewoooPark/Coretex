import type { CoretexDb } from "./mock-db";
import type { WorkspaceRole } from "@/types/node";

const roleRank: Record<WorkspaceRole, number> = {
  VIEWER: 0,
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3
};

export function hasRoleAtLeast(role: WorkspaceRole, minimum: WorkspaceRole): boolean {
  return roleRank[role] >= roleRank[minimum];
}

export function getWorkspaceRole(db: CoretexDb, workspaceId: string, userId: string): WorkspaceRole | null {
  const membership = db.workspaceMembers.find((item) => item.workspaceId === workspaceId && item.userId === userId);
  return membership?.role ?? null;
}

export function assertProjectAccess(
  db: CoretexDb,
  projectId: string,
  userId: string,
  minimum: WorkspaceRole = "VIEWER"
): { ok: true; workspaceId: string; role: WorkspaceRole } | { ok: false; code: string; message: string } {
  const project = db.projects.find((item) => item.id === projectId);
  if (!project) {
    return { ok: false, code: "PROJECT_NOT_FOUND", message: "The selected project does not exist." };
  }
  const role = getWorkspaceRole(db, project.workspaceId, userId);
  if (!role) {
    return { ok: false, code: "FORBIDDEN", message: "You are not a member of this workspace." };
  }
  if (!hasRoleAtLeast(role, minimum)) {
    return { ok: false, code: "FORBIDDEN", message: "Your role cannot perform this action." };
  }
  return { ok: true, workspaceId: project.workspaceId, role };
}

export function canMutate(role: WorkspaceRole): boolean {
  return hasRoleAtLeast(role, "MEMBER");
}
