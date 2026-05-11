import type { ContextNode, DocumentVersion, NodeEdge } from "@/types/node";

export function wouldCreateCycle(params: {
  edges: { fromNodeId: string; toNodeId: string }[];
  fromNodeId: string;
  toNodeId: string;
}): boolean {
  const { edges, fromNodeId, toNodeId } = params;
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const next = adjacency.get(edge.fromNodeId) ?? [];
    next.push(edge.toNodeId);
    adjacency.set(edge.fromNodeId, next);
  }

  const visited = new Set<string>();
  const stack = [toNodeId];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    if (current === fromNodeId) {
      return true;
    }
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    for (const next of adjacency.get(current) ?? []) {
      stack.push(next);
    }
  }
  return false;
}

export function resolveVersionAt<T extends { versionNo: number; createdAt: string | Date }>(
  versions: T[],
  at: string | Date
): T | null {
  const atTime = new Date(at).getTime();
  const candidates = versions
    .filter((version) => new Date(version.createdAt).getTime() <= atTime)
    .sort((a, b) => b.versionNo - a.versionNo);
  return candidates[0] ?? null;
}

export function isVisibleAt<T extends { createdAt: string; deletedAt?: string }>(
  item: T,
  at?: string
): boolean {
  if (!at) {
    return !item.deletedAt;
  }
  const atTime = new Date(at).getTime();
  return new Date(item.createdAt).getTime() <= atTime && (!item.deletedAt || new Date(item.deletedAt).getTime() > atTime);
}

export function activeEdgesForCycle(edges: NodeEdge[], projectId: string): NodeEdge[] {
  return edges.filter((edge) => edge.projectId === projectId && !edge.deletedAt);
}

export function nodeHasEdgeContext(node: ContextNode, edges: NodeEdge[]): boolean {
  return edges.some((edge) => edge.fromNodeId === node.id || edge.toNodeId === node.id);
}

export function latestVersion(versions: DocumentVersion[]): DocumentVersion | null {
  return [...versions].sort((a, b) => b.versionNo - a.versionNo)[0] ?? null;
}
