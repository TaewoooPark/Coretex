import type { CoretexDb } from "./mock-db";
import type { ProjectArchive } from "@/types/node";

export type ProjectArchiveContent = {
  project: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    archivedAt?: string;
  };
  overview: {
    nodeCount: number;
    edgeCount: number;
    messageCount: number;
    decisionCount: number;
    versionCount: number;
    importedFileCount: number;
  };
  decisionTimeline: {
    nodeId: string;
    title: string;
    decision: string;
    rationale?: string;
    decidedAt: string;
  }[];
  nodeGenealogy: {
    nodeId: string;
    title: string;
    type: string;
    status: string;
    parents: string[];
    children: string[];
    tags: string[];
  }[];
  finalOutputs: {
    nodeId: string;
    title: string;
    summary?: string;
    versionNo: number;
  }[];
  discardedAlternatives: {
    nodeId: string;
    title: string;
    reason?: string;
  }[];
  keyMessages: {
    id: string;
    content: string;
    linkedNodeIds: string[];
    createdAt: string;
  }[];
  sourceFiles: {
    id: string;
    path: string;
    importedNodeId?: string;
    checksum?: string;
    sizeBytes: number;
  }[];
};

export function buildProjectArchiveContent(db: CoretexDb, projectId: string): ProjectArchiveContent {
  const project = db.projects.find((item) => item.id === projectId);
  if (!project) {
    throw new Error("Project not found");
  }
  const nodes = db.nodes.filter((node) => node.projectId === projectId && !node.deletedAt);
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = db.edges.filter((edge) => edge.projectId === projectId && !edge.deletedAt);
  const versions = db.versions.filter((version) => nodeIds.has(version.nodeId));
  const decisions = db.decisions.filter((decision) => nodeIds.has(decision.nodeId));
  const messages = db.messages.filter((message) => message.projectId === projectId && !message.deletedAt);
  const sourceFiles = db.fileAssets.filter((file) => file.projectId === projectId && file.kind === "FILE");

  return {
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      archivedAt: project.archivedAt
    },
    overview: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      messageCount: messages.length,
      decisionCount: decisions.length,
      versionCount: versions.length,
      importedFileCount: sourceFiles.length
    },
    decisionTimeline: decisions
      .map((decision) => {
        const node = db.nodes.find((item) => item.id === decision.nodeId);
        return {
          nodeId: decision.nodeId,
          title: node?.title ?? "Unknown decision node",
          decision: decision.statement,
          rationale: decision.rationale,
          decidedAt: decision.decidedAt
        };
      })
      .sort((a, b) => a.decidedAt.localeCompare(b.decidedAt)),
    nodeGenealogy: nodes.map((node) => ({
      nodeId: node.id,
      title: node.title,
      type: node.type,
      status: node.status,
      parents: edges.filter((edge) => edge.toNodeId === node.id).map((edge) => edge.fromNodeId),
      children: edges.filter((edge) => edge.fromNodeId === node.id).map((edge) => edge.toNodeId),
      tags: tagsForNode(db, node.id)
    })),
    finalOutputs: nodes
      .filter((node) => node.type === "FINAL" || node.status === "FINALIZED")
      .map((node) => ({
        nodeId: node.id,
        title: node.title,
        summary: node.summary,
        versionNo: node.currentVersionNo
      })),
    discardedAlternatives: nodes
      .filter((node) => node.status === "DISCARDED")
      .map((node) => ({
        nodeId: node.id,
        title: node.title,
        reason: typeof node.metadata?.reason === "string" ? node.metadata.reason : undefined
      })),
    keyMessages: messages.slice(-10).map((message) => ({
      id: message.id,
      content: message.content,
      linkedNodeIds: db.messageNodeLinks.filter((link) => link.messageId === message.id).map((link) => link.nodeId),
      createdAt: message.createdAt
    })),
    sourceFiles: sourceFiles.map((file) => ({
      id: file.id,
      path: file.path,
      importedNodeId: file.importedNodeId,
      checksum: file.checksum,
      sizeBytes: file.sizeBytes
    }))
  };
}

export function archiveSummary(archive: ProjectArchive): string {
  const content = archive.content as unknown as ProjectArchiveContent;
  return `${content.project.name}: ${content.overview.nodeCount} nodes, ${content.overview.decisionCount} decisions, ${content.overview.versionCount} versions.`;
}

function tagsForNode(db: CoretexDb, nodeId: string): string[] {
  const tagIds = db.nodeTags.filter((item) => item.nodeId === nodeId).map((item) => item.tagId);
  return db.tags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.name);
}
