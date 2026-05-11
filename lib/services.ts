import { buildProjectArchiveContent } from "./archive";
import { extractContext } from "./ai/extractContext";
import { activeEdgesForCycle, isVisibleAt, resolveVersionAt, wouldCreateCycle } from "./graph";
import { DEMO_USER_ID, getDb, nextId, type CoretexDb } from "./mock-db";
import { assertProjectAccess, getWorkspaceRole, hasRoleAtLeast } from "./permissions";
import { normalizeTag } from "./tags";
import { checkNodeLimit, checkProjectLimit } from "./usage";
import type { ApiResponse } from "@/types/api";
import { fail, ok } from "@/types/api";
import type { GraphResponse } from "@/types/graph";
import type {
  AiSuggestion,
  ContextNode,
  DocumentVersion,
  EdgeType,
  MessageNodeLink,
  NodeEdge,
  NodeStatus,
  NodeTag,
  NodeType,
  ProjectArchive,
  SemanticTag
} from "@/types/node";

type Actor = {
  userId?: string;
};

const defaultActor = { userId: DEMO_USER_ID };

export function listWorkspaces(actor: Actor = defaultActor) {
  const db = getDb();
  const userId = actor.userId ?? DEMO_USER_ID;
  const memberships = db.workspaceMembers.filter((member) => member.userId === userId);
  return ok({
    workspaces: memberships.flatMap((membership) => {
      const workspace = db.workspaces.find((item) => item.id === membership.workspaceId);
      return workspace
        ? [
            {
              id: workspace.id,
              name: workspace.name,
              slug: workspace.slug,
              role: membership.role
            }
          ]
        : [];
    })
  });
}

export function createWorkspace(input: { name: string; slug: string }, actor: Actor = defaultActor) {
  const db = getDb();
  const userId = actor.userId ?? DEMO_USER_ID;
  const ownedWorkspaceCount = db.workspaceMembers.filter((member) => member.userId === userId).length;
  if (ownedWorkspaceCount >= 1) {
    return fail("PLAN_LIMIT_EXCEEDED", "The FREE plan allows one workspace.");
  }
  if (db.workspaces.some((workspace) => workspace.slug === input.slug)) {
    return fail("SLUG_TAKEN", "A workspace with this slug already exists.");
  }
  const now = new Date().toISOString();
  const workspace = {
    id: nextId(db, "workspace"),
    name: input.name,
    slug: input.slug,
    createdAt: now,
    updatedAt: now
  };
  db.workspaces.push(workspace);
  db.workspaceMembers.push({
    id: nextId(db, "member"),
    workspaceId: workspace.id,
    userId,
    role: "OWNER",
    createdAt: now
  });
  db.billingAccounts.push({
    id: nextId(db, "billing"),
    workspaceId: workspace.id,
    plan: "FREE",
    nodeLimit: 100,
    storageLimitMb: 500,
    aiExtractionLimit: 100,
    aiExtractionCount: 0,
    createdAt: now,
    updatedAt: now
  });
  return ok({ workspace });
}

export function listProjects(workspaceId: string, actor: Actor = defaultActor) {
  const db = getDb();
  const role = getWorkspaceRole(db, workspaceId, actor.userId ?? DEMO_USER_ID);
  if (!role) {
    return fail("FORBIDDEN", "You are not a member of this workspace.");
  }
  return ok({
    projects: db.projects
      .filter((project) => project.workspaceId === workspaceId)
      .map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        nodeCount: db.nodes.filter((node) => node.projectId === project.id && !node.deletedAt).length,
        updatedAt: project.updatedAt
      }))
  });
}

export function createProject(workspaceId: string, input: { name: string; description?: string }, actor: Actor = defaultActor) {
  const db = getDb();
  const userId = actor.userId ?? DEMO_USER_ID;
  const role = getWorkspaceRole(db, workspaceId, userId);
  if (!role || !hasRoleAtLeast(role, "MEMBER")) {
    return fail("FORBIDDEN", "Your role cannot create projects.");
  }
  const limit = checkProjectLimit(db, workspaceId);
  if (!limit.ok) {
    return fail(limit.code, limit.message);
  }

  const now = new Date().toISOString();
  const project = {
    id: nextId(db, "project"),
    workspaceId,
    name: input.name,
    description: input.description,
    status: "ACTIVE" as const,
    createdAt: now,
    updatedAt: now
  };
  db.projects.push(project);

  const brief = makeNode(db, {
    projectId: project.id,
    title: "Project Brief",
    type: "BRIEF",
    status: "RAW",
    summary: "Starting brief for this project.",
    positionX: 360,
    positionY: 80,
    createdById: userId,
    now
  });
  const idea = makeNode(db, {
    projectId: project.id,
    title: "Initial Idea",
    type: "IDEA",
    status: "RAW",
    summary: "First seed idea.",
    positionX: 40,
    positionY: 80,
    createdById: userId,
    now
  });
  db.nodes.push(brief, idea);
  db.versions.push(makeVersion(db, brief.id, 1, brief.title, brief.content ?? {}, "Initial brief", userId, now));
  db.versions.push(makeVersion(db, idea.id, 1, idea.title, idea.content ?? {}, "Initial idea", userId, now));
  const edge = makeEdge(db, project.id, idea.id, brief.id, "SUPPORTS", undefined, now);
  db.edges.push(edge);
  pushEvent(db, project.id, "NODE_CREATED", userId, brief.id);
  pushEvent(db, project.id, "NODE_CREATED", userId, idea.id);
  pushEvent(db, project.id, "EDGE_CREATED", userId, undefined, { edgeId: edge.id });
  return ok({ project, nodes: [idea, brief], edge });
}

export function getGraph(
  projectId: string,
  filters: {
    at?: string;
    tag?: string;
    type?: NodeType;
    status?: NodeStatus;
    depth?: number;
    focusNodeId?: string;
  } = {},
  actor: Actor = defaultActor
): ApiResponse<GraphResponse> {
  const db = getDb();
  const access = assertProjectAccess(db, projectId, actor.userId ?? DEMO_USER_ID);
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  const project = db.projects.find((item) => item.id === projectId);
  if (!project) {
    return fail("PROJECT_NOT_FOUND", "The selected project does not exist.");
  }

  const visibleNodes = db.nodes.filter((node) => node.projectId === projectId && isVisibleAt(node, filters.at));
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = db.edges.filter(
    (edge) =>
      edge.projectId === projectId &&
      isVisibleAt(edge, filters.at) &&
      visibleNodeIds.has(edge.fromNodeId) &&
      visibleNodeIds.has(edge.toNodeId)
  );
  const depthNodeIds =
    filters.focusNodeId && Number.isFinite(filters.depth)
      ? collectDepthNodeIds(filters.focusNodeId, filters.depth ?? 1, visibleEdges)
      : null;

  let nodes = visibleNodes;
  if (filters.type) {
    nodes = nodes.filter((node) => node.type === filters.type);
  }
  if (filters.status) {
    nodes = nodes.filter((node) => node.status === filters.status);
  }
  if (filters.tag) {
    const normalized = normalizeTag(filters.tag);
    const tag = db.tags.find((item) => item.projectId === projectId && item.normalized === normalized);
    const taggedNodeIds = tag ? db.nodeTags.filter((item) => item.tagId === tag.id).map((item) => item.nodeId) : [];
    nodes = nodes.filter((node) => taggedNodeIds.includes(node.id));
  }
  if (depthNodeIds) {
    nodes = nodes.filter((node) => depthNodeIds.has(node.id));
  }
  const filteredNodeIds = new Set(nodes.map((node) => node.id));

  const events = db.events.filter((event) => event.projectId === projectId);
  const start = events.sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0]?.createdAt ?? project.createdAt;
  const end = new Date().toISOString();

  return ok({
    project: {
      id: project.id,
      name: project.name
    },
    nodes: nodes.map((node) => {
      const versions = db.versions.filter((version) => version.nodeId === node.id);
      const resolved = filters.at ? resolveVersionAt(versions, filters.at) : resolveVersionAt(versions, end);
      return {
        id: node.id,
        title: node.title,
        type: node.type,
        status: node.status,
        summary: node.summary,
        position: {
          x: node.positionX,
          y: node.positionY
        },
        currentVersionNo: resolved?.versionNo ?? node.currentVersionNo,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        deletedAt: node.deletedAt,
        tags: tagsForNode(db, node.id),
        content: resolved?.content ?? node.content,
        plainText: resolved?.plainText
      };
    }),
    edges: visibleEdges
      .filter((edge) => filteredNodeIds.has(edge.fromNodeId) && filteredNodeIds.has(edge.toNodeId))
      .map((edge) => ({
        id: edge.id,
        fromNodeId: edge.fromNodeId,
        toNodeId: edge.toNodeId,
        type: edge.type,
        label: edge.label,
        createdAt: edge.createdAt,
        deletedAt: edge.deletedAt
      })),
    timeRange: {
      start,
      end
    }
  });
}

export async function createNode(
  projectId: string,
  input: {
    title: string;
    type: NodeType;
    status?: NodeStatus;
    summary?: string;
    content?: Record<string, unknown>;
    position?: { x: number; y: number };
    parentNodeId?: string;
    edgeType?: EdgeType;
  },
  actor: Actor = defaultActor
) {
  const db = getDb();
  const access = assertProjectAccess(db, projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  const limit = checkNodeLimit(db, access.workspaceId);
  if (!limit.ok) {
    return fail(limit.code, limit.message);
  }
  if (input.parentNodeId && !db.nodes.some((node) => node.id === input.parentNodeId && node.projectId === projectId && !node.deletedAt)) {
    return fail("NODE_NOT_FOUND", "The parent node does not exist or has been deleted.");
  }

  const now = new Date().toISOString();
  const userId = actor.userId ?? DEMO_USER_ID;
  const node = makeNode(db, {
    projectId,
    title: input.title,
    type: input.type,
    status: input.status ?? "RAW",
    summary: input.summary,
    content: input.content,
    positionX: input.position?.x ?? 120,
    positionY: input.position?.y ?? 120,
    createdById: userId,
    now
  });
  db.nodes.push(node);
  db.versions.push(makeVersion(db, node.id, 1, input.title, node.content ?? {}, "Initial version", userId, now));
  pushEvent(db, projectId, "NODE_CREATED", userId, node.id);

  let edge: NodeEdge | undefined;
  if (input.parentNodeId) {
    const created = createEdgeInternal(db, projectId, input.parentNodeId, node.id, input.edgeType ?? "DERIVES_FROM", undefined, userId, now);
    if (!created.ok) {
      return fail(created.code, created.message);
    }
    edge = created.edge;
  }
  return ok({ node, edge });
}

export function updateNode(
  nodeId: string,
  input: Partial<Pick<ContextNode, "title" | "type" | "status" | "summary" | "metadata">> & { position?: { x: number; y: number } },
  actor: Actor = defaultActor
) {
  const db = getDb();
  const node = db.nodes.find((item) => item.id === nodeId && !item.deletedAt);
  if (!node) {
    return fail("NODE_NOT_FOUND", "The selected node does not exist or has been deleted.");
  }
  const access = assertProjectAccess(db, node.projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  if (input.title !== undefined) node.title = input.title;
  if (input.type !== undefined) node.type = input.type;
  if (input.status !== undefined) node.status = input.status;
  if (input.summary !== undefined) node.summary = input.summary;
  if (input.metadata !== undefined) node.metadata = input.metadata;
  if (input.position) {
    node.positionX = input.position.x;
    node.positionY = input.position.y;
  }
  node.updatedAt = new Date().toISOString();
  pushEvent(db, node.projectId, "NODE_UPDATED", actor.userId ?? DEMO_USER_ID, node.id);
  return ok({ node });
}

export function deleteNode(nodeId: string, actor: Actor = defaultActor) {
  const db = getDb();
  const node = db.nodes.find((item) => item.id === nodeId && !item.deletedAt);
  if (!node) {
    return fail("NODE_NOT_FOUND", "The selected node does not exist or has been deleted.");
  }
  const access = assertProjectAccess(db, node.projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  const now = new Date().toISOString();
  node.deletedAt = now;
  node.updatedAt = now;
  for (const edge of db.edges.filter((item) => !item.deletedAt && (item.fromNodeId === node.id || item.toNodeId === node.id))) {
    edge.deletedAt = now;
    edge.updatedAt = now;
  }
  pushEvent(db, node.projectId, "NODE_DELETED", actor.userId ?? DEMO_USER_ID, node.id);
  return ok({ node });
}

export function createEdge(
  projectId: string,
  input: { fromNodeId: string; toNodeId: string; type: EdgeType; label?: string },
  actor: Actor = defaultActor
) {
  const db = getDb();
  const access = assertProjectAccess(db, projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  const created = createEdgeInternal(
    db,
    projectId,
    input.fromNodeId,
    input.toNodeId,
    input.type,
    input.label,
    actor.userId ?? DEMO_USER_ID,
    new Date().toISOString()
  );
  return created.ok ? ok({ edge: created.edge }) : fail(created.code, created.message);
}

export function deleteEdge(edgeId: string, actor: Actor = defaultActor) {
  const db = getDb();
  const edge = db.edges.find((item) => item.id === edgeId && !item.deletedAt);
  if (!edge) {
    return fail("EDGE_NOT_FOUND", "The selected edge does not exist or has already been deleted.");
  }
  const access = assertProjectAccess(db, edge.projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  const now = new Date().toISOString();
  edge.deletedAt = now;
  edge.updatedAt = now;
  pushEvent(db, edge.projectId, "EDGE_DELETED", actor.userId ?? DEMO_USER_ID, undefined, { edgeId });
  return ok({ edge });
}

export function listVersions(nodeId: string, actor: Actor = defaultActor) {
  const db = getDb();
  const node = db.nodes.find((item) => item.id === nodeId);
  if (!node) {
    return fail("NODE_NOT_FOUND", "The selected node does not exist or has been deleted.");
  }
  const access = assertProjectAccess(db, node.projectId, actor.userId ?? DEMO_USER_ID);
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  return ok({
    versions: db.versions
      .filter((version) => version.nodeId === nodeId)
      .sort((a, b) => b.versionNo - a.versionNo)
      .map((version) => ({
        ...version,
        createdBy: userSummary(db, version.createdById)
      }))
  });
}

export function createVersion(
  nodeId: string,
  input: {
    title?: string;
    content: Record<string, unknown>;
    plainText?: string;
    changeSummary?: string;
  },
  actor: Actor = defaultActor
) {
  const db = getDb();
  const node = db.nodes.find((item) => item.id === nodeId && !item.deletedAt);
  if (!node) {
    return fail("NODE_NOT_FOUND", "The selected node does not exist or has been deleted.");
  }
  const access = assertProjectAccess(db, node.projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  const now = new Date().toISOString();
  const versionNo = node.currentVersionNo + 1;
  const version = makeVersion(
    db,
    node.id,
    versionNo,
    input.title ?? node.title,
    input.content,
    input.changeSummary,
    actor.userId ?? DEMO_USER_ID,
    now,
    input.plainText
  );
  db.versions.push(version);
  node.currentVersionNo = versionNo;
  node.content = input.content;
  node.updatedAt = now;
  pushEvent(db, node.projectId, "VERSION_CREATED", actor.userId ?? DEMO_USER_ID, node.id, { versionNo });
  return ok({ version, node });
}

export function restoreVersion(nodeId: string, versionNo: number, at?: string, actor: Actor = defaultActor) {
  const db = getDb();
  const version = db.versions.find((item) => item.nodeId === nodeId && item.versionNo === versionNo);
  if (!version) {
    return fail("VERSION_NOT_FOUND", "The selected version does not exist.");
  }
  return createVersion(
    nodeId,
    {
      title: version.title,
      content: version.content,
      plainText: version.plainText,
      changeSummary: `Restored from version ${versionNo}${at ? ` at ${at}` : ""}`
    },
    actor
  );
}

export function listMessages(projectId: string, query: { nodeId?: string; before?: string; limit?: number } = {}, actor: Actor = defaultActor) {
  const db = getDb();
  const access = assertProjectAccess(db, projectId, actor.userId ?? DEMO_USER_ID);
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  let messages = db.messages.filter((message) => message.projectId === projectId && !message.deletedAt);
  if (query.nodeId) {
    const linkedMessageIds = db.messageNodeLinks.filter((link) => link.nodeId === query.nodeId).map((link) => link.messageId);
    messages = messages.filter((message) => message.scopeNodeId === query.nodeId || linkedMessageIds.includes(message.id));
  }
  if (query.before) {
    messages = messages.filter((message) => message.createdAt < query.before!);
  }
  const limit = query.limit ?? 50;
  return ok({
    messages: messages
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .slice(-limit)
      .map((message) => ({
        ...message,
        author: userSummary(db, message.authorId),
        linkedNodes: db.messageNodeLinks
          .filter((link) => link.messageId === message.id)
          .map((link) => ({
            ...link,
            node: db.nodes.find((node) => node.id === link.nodeId)
          })),
        tags: tagsForMessage(db, message.id)
      }))
  });
}

export async function createMessage(
  projectId: string,
  input: { content: string; scopeNodeId?: string },
  actor: Actor = defaultActor
) {
  const db = getDb();
  const access = assertProjectAccess(db, projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  if (input.scopeNodeId && !db.nodes.some((node) => node.id === input.scopeNodeId && node.projectId === projectId && !node.deletedAt)) {
    return fail("NODE_NOT_FOUND", "The scoped node does not exist or has been deleted.");
  }
  const now = new Date().toISOString();
  const message = {
    id: nextId(db, "message"),
    projectId,
    authorId: actor.userId ?? DEMO_USER_ID,
    content: input.content,
    createdAt: now,
    updatedAt: now,
    scopeNodeId: input.scopeNodeId,
    aiProcessed: false
  };
  db.messages.push(message);
  pushEvent(db, projectId, "MESSAGE_CREATED", actor.userId ?? DEMO_USER_ID, undefined, { messageId: message.id });

  const extraction = await runExtractionForSource(db, projectId, "MESSAGE", message.id, input.content, input.scopeNodeId);
  message.aiProcessed = true;
  return ok({ message, extraction });
}

export function linkMessageToNode(messageId: string, input: { nodeId: string; reason?: string }, actor: Actor = defaultActor) {
  const db = getDb();
  const message = db.messages.find((item) => item.id === messageId && !item.deletedAt);
  const node = db.nodes.find((item) => item.id === input.nodeId && !item.deletedAt);
  if (!message || !node || message.projectId !== node.projectId) {
    return fail("NODE_NOT_FOUND", "The message and node must exist in the same project.");
  }
  const access = assertProjectAccess(db, message.projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  const link = ensureMessageNodeLink(db, message.id, node.id, "MANUAL", 1, input.reason ?? "Manual link");
  pushEvent(db, message.projectId, "MESSAGE_LINKED", actor.userId ?? DEMO_USER_ID, node.id, { messageId });
  return ok({ link });
}

export async function extractContextForApi(
  input: { projectId: string; sourceType: "MESSAGE" | "DOCUMENT"; sourceId: string; text: string },
  actor: Actor = defaultActor
) {
  const db = getDb();
  const access = assertProjectAccess(db, input.projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  const extraction = await runExtractionForSource(db, input.projectId, input.sourceType, input.sourceId, input.text);
  return ok(extraction);
}

export function listAiSuggestions(projectId: string, actor: Actor = defaultActor) {
  const db = getDb();
  const access = assertProjectAccess(db, projectId, actor.userId ?? DEMO_USER_ID);
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  return ok({
    suggestions: db.aiSuggestions
      .filter((suggestion) => suggestion.projectId === projectId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  });
}

export function resolveAiSuggestion(suggestionId: string, action: "ACCEPT" | "REJECT", actor: Actor = defaultActor) {
  const db = getDb();
  const suggestion = db.aiSuggestions.find((item) => item.id === suggestionId);
  if (!suggestion) {
    return fail("SUGGESTION_NOT_FOUND", "The selected suggestion does not exist.");
  }
  const access = assertProjectAccess(db, suggestion.projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  if (action === "REJECT") {
    suggestion.status = "REJECTED";
    return ok({ suggestion });
  }
  suggestion.status = "ACCEPTED";
  const payload = suggestion.payload;
  if (suggestion.kind === "TAG" && typeof payload.name === "string") {
    const tag = ensureTag(db, suggestion.projectId, payload.name);
    if (suggestion.sourceType === "MESSAGE") {
      ensureMessageTag(db, suggestion.sourceId, tag.id, suggestion.confidence, "AI");
    } else if (typeof payload.nodeId === "string") {
      ensureNodeTag(db, payload.nodeId, tag.id, suggestion.confidence, "AI");
    }
  }
  if (suggestion.kind === "NODE_LINK" && typeof payload.nodeId === "string" && suggestion.sourceType === "MESSAGE") {
    ensureMessageNodeLink(db, suggestion.sourceId, payload.nodeId, "AI", suggestion.confidence, String(payload.reason ?? "Accepted AI suggestion"));
  }
  if (
    suggestion.kind === "EDGE" &&
    typeof payload.fromNodeId === "string" &&
    typeof payload.toNodeId === "string" &&
    typeof payload.type === "string"
  ) {
    createEdgeInternal(
      db,
      suggestion.projectId,
      payload.fromNodeId,
      payload.toNodeId,
      payload.type as EdgeType,
      undefined,
      actor.userId ?? DEMO_USER_ID,
      new Date().toISOString(),
      suggestion.confidence
    );
  }
  if (suggestion.kind === "DECISION" && typeof payload.nodeId === "string" && typeof payload.statement === "string") {
    db.decisions.push({
      id: nextId(db, "decision"),
      nodeId: payload.nodeId,
      statement: payload.statement,
      rationale: typeof payload.rationale === "string" ? payload.rationale : undefined,
      decidedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
  }
  return ok({ suggestion });
}

export function searchProject(projectId: string, q: string, actor: Actor = defaultActor) {
  const db = getDb();
  const access = assertProjectAccess(db, projectId, actor.userId ?? DEMO_USER_ID);
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  const query = q.trim().toLowerCase();
  if (!query) {
    return ok({ results: [] });
  }
  const projectNodeIds = new Set(db.nodes.filter((node) => node.projectId === projectId).map((node) => node.id));
  const results = [
    ...db.nodes
      .filter((node) => node.projectId === projectId && !node.deletedAt && matches(query, node.title, node.summary))
      .map((node) => ({ type: "NODE" as const, id: node.id, title: node.title, excerpt: node.summary, score: score(query, node.title) })),
    ...db.messages
      .filter((message) => message.projectId === projectId && !message.deletedAt && matches(query, message.content))
      .map((message) => ({ type: "MESSAGE" as const, id: message.id, title: message.content.slice(0, 80), excerpt: message.content, score: 0.7 })),
    ...db.tags
      .filter((tag) => tag.projectId === projectId && matches(query, tag.name, tag.normalized))
      .map((tag) => ({ type: "TAG" as const, id: tag.id, title: `#${tag.name}`, excerpt: tag.description, score: score(query, tag.name) })),
    ...db.decisions
      .filter((decision) => projectNodeIds.has(decision.nodeId) && matches(query, decision.statement, decision.rationale))
      .map((decision) => ({ type: "DECISION" as const, id: decision.id, title: decision.statement, excerpt: decision.rationale, score: 0.8 }))
  ].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return ok({ results });
}

export function listArchives(projectId: string, actor: Actor = defaultActor) {
  const db = getDb();
  const access = assertProjectAccess(db, projectId, actor.userId ?? DEMO_USER_ID);
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  return ok({
    archives: db.archives.filter((archive) => archive.projectId === projectId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  });
}

export function createArchive(projectId: string, actor: Actor = defaultActor): ApiResponse<{ archive: ProjectArchive }> {
  const db = getDb();
  const access = assertProjectAccess(db, projectId, actor.userId ?? DEMO_USER_ID, "MEMBER");
  if (!access.ok) {
    return fail(access.code, access.message);
  }
  const project = db.projects.find((item) => item.id === projectId);
  if (!project) {
    return fail("PROJECT_NOT_FOUND", "The selected project does not exist.");
  }
  const now = new Date().toISOString();
  const content = buildProjectArchiveContent(db, projectId);
  const archive: ProjectArchive = {
    id: nextId(db, "archive"),
    projectId,
    title: `${project.name} Archive ${new Date(now).toISOString().slice(0, 10)}`,
    summary: `${content.overview.nodeCount} nodes, ${content.overview.edgeCount} edges, ${content.overview.decisionCount} decisions.`,
    content: content as unknown as Record<string, unknown>,
    createdAt: now
  };
  db.archives.push(archive);
  pushEvent(db, projectId, "ARCHIVE_CREATED", actor.userId ?? DEMO_USER_ID, undefined, { archiveId: archive.id });
  return ok({ archive });
}

function createEdgeInternal(
  db: CoretexDb,
  projectId: string,
  fromNodeId: string,
  toNodeId: string,
  type: EdgeType,
  label: string | undefined,
  userId: string,
  now: string,
  confidence?: number
): { ok: true; edge: NodeEdge } | { ok: false; code: string; message: string } {
  if (fromNodeId === toNodeId) {
    return { ok: false, code: "EDGE_INVALID", message: "An edge cannot connect a node to itself." };
  }
  const fromNode = db.nodes.find((node) => node.id === fromNodeId && !node.deletedAt);
  const toNode = db.nodes.find((node) => node.id === toNodeId && !node.deletedAt);
  if (!fromNode || !toNode || fromNode.projectId !== projectId || toNode.projectId !== projectId) {
    return { ok: false, code: "NODE_NOT_FOUND", message: "Both nodes must exist in the same project." };
  }
  const duplicate = db.edges.some(
    (edge) => !edge.deletedAt && edge.fromNodeId === fromNodeId && edge.toNodeId === toNodeId && edge.type === type
  );
  if (duplicate) {
    return { ok: false, code: "EDGE_DUPLICATED", message: "This relationship already exists between the selected nodes." };
  }
  const activeEdges = activeEdgesForCycle(db.edges, projectId);
  if (wouldCreateCycle({ edges: activeEdges, fromNodeId, toNodeId })) {
    return {
      ok: false,
      code: "CYCLE_NOT_ALLOWED",
      message: "This edge would create a circular genealogy. CORETEX requires decision flows to remain acyclic."
    };
  }
  const edge = makeEdge(db, projectId, fromNodeId, toNodeId, type, label, now, confidence);
  db.edges.push(edge);
  pushEvent(db, projectId, "EDGE_CREATED", userId, undefined, { edgeId: edge.id });
  return { ok: true, edge };
}

function makeNode(
  db: CoretexDb,
  input: {
    projectId: string;
    title: string;
    type: NodeType;
    status: NodeStatus;
    summary?: string;
    content?: Record<string, unknown>;
    positionX: number;
    positionY: number;
    createdById: string;
    now: string;
  }
): ContextNode {
  return {
    id: nextId(db, "node"),
    projectId: input.projectId,
    title: input.title,
    type: input.type,
    status: input.status,
    summary: input.summary,
    content: input.content ?? docFromText(input.summary ?? input.title),
    positionX: input.positionX,
    positionY: input.positionY,
    createdById: input.createdById,
    createdAt: input.now,
    updatedAt: input.now,
    currentVersionNo: 1
  };
}

function makeEdge(
  db: CoretexDb,
  projectId: string,
  fromNodeId: string,
  toNodeId: string,
  type: EdgeType,
  label: string | undefined,
  now: string,
  confidence?: number
): NodeEdge {
  return {
    id: nextId(db, "edge"),
    projectId,
    fromNodeId,
    toNodeId,
    type,
    label,
    weight: 1,
    confidence,
    createdAt: now,
    updatedAt: now
  };
}

function makeVersion(
  db: CoretexDb,
  nodeId: string,
  versionNo: number,
  title: string,
  content: Record<string, unknown>,
  changeSummary: string | undefined,
  createdById: string,
  now: string,
  plainText?: string
): DocumentVersion {
  return {
    id: nextId(db, "version"),
    nodeId,
    versionNo,
    title,
    content,
    plainText: plainText ?? extractPlainText(content),
    changeSummary,
    createdById,
    createdAt: now
  };
}

function pushEvent(
  db: CoretexDb,
  projectId: string,
  type: Parameters<typeof eventPayload>[0],
  actorId: string,
  nodeId?: string,
  payload?: Record<string, unknown>
) {
  db.events.push({
    id: nextId(db, "event"),
    projectId,
    nodeId,
    actorId,
    type,
    payload,
    createdAt: new Date().toISOString()
  });
}

function eventPayload(type: import("@/types/node").ActivityEventType) {
  return type;
}

async function runExtractionForSource(
  db: CoretexDb,
  projectId: string,
  sourceType: "MESSAGE" | "DOCUMENT",
  sourceId: string,
  text: string,
  sourceNodeId?: string
) {
  const project = db.projects.find((item) => item.id === projectId);
  const existingNodes = db.nodes
    .filter((node) => node.projectId === projectId && !node.deletedAt)
    .map((node) => ({
      id: node.id,
      title: node.title,
      type: node.type,
      summary: node.summary,
      tags: tagsForNode(db, node.id)
    }));
  const extraction = await extractContext({
    projectName: project?.name ?? "Untitled project",
    text,
    existingNodes,
    sourceNodeId
  });

  for (const tagSuggestion of extraction.suggestedTags) {
    if (tagSuggestion.confidence >= 0.85) {
      const tag = ensureTag(db, projectId, tagSuggestion.name);
      if (sourceType === "MESSAGE") {
        ensureMessageTag(db, sourceId, tag.id, tagSuggestion.confidence, "AI");
      }
      if (sourceType === "DOCUMENT" && sourceNodeId) {
        ensureNodeTag(db, sourceNodeId, tag.id, tagSuggestion.confidence, "AI");
      }
    } else if (tagSuggestion.confidence >= 0.6) {
      createSuggestion(db, projectId, sourceType, sourceId, "TAG", tagSuggestion.confidence, { name: tagSuggestion.name, nodeId: sourceNodeId });
    }
  }

  for (const linkSuggestion of extraction.suggestedNodeLinks) {
    if (linkSuggestion.confidence >= 0.85 && sourceType === "MESSAGE") {
      ensureMessageNodeLink(db, sourceId, linkSuggestion.nodeId, "AI", linkSuggestion.confidence, linkSuggestion.reason);
    } else if (linkSuggestion.confidence >= 0.6) {
      createSuggestion(db, projectId, sourceType, sourceId, "NODE_LINK", linkSuggestion.confidence, linkSuggestion);
    }
  }

  for (const edgeSuggestion of extraction.suggestedEdges) {
    if (edgeSuggestion.confidence >= 0.6) {
      createSuggestion(db, projectId, sourceType, sourceId, "EDGE", edgeSuggestion.confidence, edgeSuggestion);
    }
  }

  if (extraction.suggestedDecision && extraction.suggestedDecision.confidence >= 0.6) {
    const nodeId = sourceNodeId ?? extraction.suggestedNodeLinks[0]?.nodeId ?? db.nodes.find((node) => node.projectId === projectId && node.type === "DECISION")?.id;
    if (nodeId) {
      createSuggestion(db, projectId, sourceType, sourceId, "DECISION", extraction.suggestedDecision.confidence, {
        nodeId,
        statement: extraction.suggestedDecision.statement,
        rationale: extraction.suggestedDecision.rationale
      });
    }
  }

  return extraction;
}

function createSuggestion(
  db: CoretexDb,
  projectId: string,
  sourceType: AiSuggestion["sourceType"],
  sourceId: string,
  kind: AiSuggestion["kind"],
  confidence: number,
  payload: Record<string, unknown>
) {
  db.aiSuggestions.push({
    id: nextId(db, "suggestion"),
    projectId,
    sourceType,
    sourceId,
    kind,
    payload,
    confidence,
    status: "PENDING",
    createdAt: new Date().toISOString()
  });
}

function ensureTag(db: CoretexDb, projectId: string, name: string): SemanticTag {
  const normalized = normalizeTag(name);
  const existing = db.tags.find((tag) => tag.projectId === projectId && tag.normalized === normalized);
  if (existing) {
    return existing;
  }
  const tag: SemanticTag = {
    id: nextId(db, "tag"),
    projectId,
    name: normalized,
    normalized,
    createdAt: new Date().toISOString()
  };
  db.tags.push(tag);
  return tag;
}

function ensureNodeTag(db: CoretexDb, nodeId: string, tagId: string, confidence: number, source: NodeTag["source"]) {
  const existing = db.nodeTags.find((item) => item.nodeId === nodeId && item.tagId === tagId);
  if (existing) {
    return existing;
  }
  const nodeTag: NodeTag = {
    id: nextId(db, "nodeTag"),
    nodeId,
    tagId,
    confidence,
    source,
    createdAt: new Date().toISOString()
  };
  db.nodeTags.push(nodeTag);
  return nodeTag;
}

function ensureMessageTag(db: CoretexDb, messageId: string, tagId: string, confidence: number, source: NodeTag["source"]) {
  const existing = db.messageTags.find((item) => item.messageId === messageId && item.tagId === tagId);
  if (existing) {
    return existing;
  }
  const messageTag = {
    id: nextId(db, "messageTag"),
    messageId,
    tagId,
    confidence,
    source,
    createdAt: new Date().toISOString()
  };
  db.messageTags.push(messageTag);
  return messageTag;
}

function ensureMessageNodeLink(
  db: CoretexDb,
  messageId: string,
  nodeId: string,
  source: MessageNodeLink["source"],
  confidence: number,
  reason: string
) {
  const existing = db.messageNodeLinks.find((link) => link.messageId === messageId && link.nodeId === nodeId);
  if (existing) {
    return existing;
  }
  const link: MessageNodeLink = {
    id: nextId(db, "link"),
    messageId,
    nodeId,
    source,
    confidence,
    reason,
    createdAt: new Date().toISOString()
  };
  db.messageNodeLinks.push(link);
  return link;
}

function tagsForNode(db: CoretexDb, nodeId: string): string[] {
  const tagIds = db.nodeTags.filter((item) => item.nodeId === nodeId).map((item) => item.tagId);
  return db.tags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.name);
}

function tagsForMessage(db: CoretexDb, messageId: string): string[] {
  const tagIds = db.messageTags.filter((item) => item.messageId === messageId).map((item) => item.tagId);
  return db.tags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.name);
}

function userSummary(db: CoretexDb, userId: string) {
  const user = db.users.find((item) => item.id === userId);
  return {
    id: userId,
    name: user?.name,
    email: user?.email
  };
}

function collectDepthNodeIds(focusNodeId: string, depth: number, edges: NodeEdge[]): Set<string> {
  const result = new Set<string>([focusNodeId]);
  const queue = [{ nodeId: focusNodeId, depth: 0 }];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || current.depth >= depth) {
      continue;
    }
    const neighbors = edges
      .filter((edge) => edge.fromNodeId === current.nodeId || edge.toNodeId === current.nodeId)
      .flatMap((edge) => [edge.fromNodeId, edge.toNodeId])
      .filter((id) => id !== current.nodeId);
    for (const neighbor of neighbors) {
      if (!result.has(neighbor)) {
        result.add(neighbor);
        queue.push({ nodeId: neighbor, depth: current.depth + 1 });
      }
    }
  }
  return result;
}

function matches(query: string, ...values: (string | undefined)[]) {
  return values.some((value) => value?.toLowerCase().includes(query));
}

function score(query: string, value: string) {
  const lower = value.toLowerCase();
  if (lower === query) return 1;
  if (lower.startsWith(query)) return 0.9;
  return 0.75;
}

function docFromText(text: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }]
      }
    ]
  };
}

function extractPlainText(content: Record<string, unknown>): string {
  const texts: string[] = [];
  walk(content);
  return texts.join(" ").trim();

  function walk(value: unknown) {
    if (!value || typeof value !== "object") {
      return;
    }
    if ("text" in value && typeof (value as { text?: unknown }).text === "string") {
      texts.push((value as { text: string }).text);
    }
    for (const child of Object.values(value as Record<string, unknown>)) {
      if (Array.isArray(child)) {
        child.forEach(walk);
      } else if (typeof child === "object") {
        walk(child);
      }
    }
  }
}
