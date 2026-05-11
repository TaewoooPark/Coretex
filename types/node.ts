export const nodeTypes = [
  "IDEA",
  "BRIEF",
  "RESEARCH",
  "DRAFT",
  "EXPERIMENT",
  "FEEDBACK",
  "DECISION",
  "TASK",
  "ASSET",
  "FINAL",
  "ARCHIVE"
] as const;

export type NodeType = (typeof nodeTypes)[number];

export const nodeStatuses = [
  "RAW",
  "IN_PROGRESS",
  "REVIEW",
  "DECIDED",
  "DISCARDED",
  "FINALIZED"
] as const;

export type NodeStatus = (typeof nodeStatuses)[number];

export const edgeTypes = [
  "DERIVES_FROM",
  "SUPPORTS",
  "CONTRADICTS",
  "REFINES",
  "REPLACES",
  "REFERENCES",
  "DECIDES",
  "BLOCKS"
] as const;

export type EdgeType = (typeof edgeTypes)[number];

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export type ProjectStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";
export type LinkSource = "MANUAL" | "AI" | "RULE";
export type ActivityEventType =
  | "NODE_CREATED"
  | "NODE_UPDATED"
  | "NODE_DELETED"
  | "EDGE_CREATED"
  | "EDGE_DELETED"
  | "VERSION_CREATED"
  | "MESSAGE_CREATED"
  | "MESSAGE_LINKED"
  | "TAG_CREATED"
  | "TAG_LINKED"
  | "DECISION_CREATED"
  | "ARCHIVE_CREATED";

export type JsonRecord = Record<string, unknown>;

export type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  createdAt: string;
};

export type Project = {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
};

export type ContextNode = {
  id: string;
  projectId: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
  summary?: string;
  content?: JsonRecord;
  positionX: number;
  positionY: number;
  width?: number;
  height?: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  currentVersionNo: number;
  metadata?: JsonRecord;
  aiSummary?: string;
  confidence?: number;
};

export type NodeEdge = {
  id: string;
  projectId: string;
  fromNodeId: string;
  toNodeId: string;
  type: EdgeType;
  label?: string;
  weight: number;
  confidence?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type DocumentVersion = {
  id: string;
  nodeId: string;
  versionNo: number;
  title?: string;
  content: JsonRecord;
  plainText?: string;
  changeSummary?: string;
  createdById: string;
  createdAt: string;
};

export type Message = {
  id: string;
  projectId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  scopeNodeId?: string;
  aiProcessed: boolean;
};

export type MessageNodeLink = {
  id: string;
  messageId: string;
  nodeId: string;
  source: LinkSource;
  confidence?: number;
  reason?: string;
  createdAt: string;
};

export type SemanticTag = {
  id: string;
  projectId: string;
  name: string;
  normalized: string;
  description?: string;
  createdAt: string;
};

export type NodeTag = {
  id: string;
  nodeId: string;
  tagId: string;
  confidence?: number;
  source: LinkSource;
  createdAt: string;
};

export type MessageTag = {
  id: string;
  messageId: string;
  tagId: string;
  confidence?: number;
  source: LinkSource;
  createdAt: string;
};

export type Decision = {
  id: string;
  nodeId: string;
  statement: string;
  rationale?: string;
  outcome?: string;
  decidedAt: string;
  createdAt: string;
};

export type ActivityEvent = {
  id: string;
  projectId: string;
  nodeId?: string;
  actorId?: string;
  type: ActivityEventType;
  payload?: JsonRecord;
  createdAt: string;
};

export type ProjectArchive = {
  id: string;
  projectId: string;
  title: string;
  summary?: string;
  content: JsonRecord;
  createdAt: string;
};

export type BillingPlan = "FREE" | "TEAM" | "BUSINESS" | "ENTERPRISE";

export type BillingAccount = {
  id: string;
  workspaceId: string;
  plan: BillingPlan;
  nodeLimit: number;
  storageLimitMb: number;
  aiExtractionLimit: number;
  aiExtractionCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AiSuggestion = {
  id: string;
  projectId: string;
  sourceType: "MESSAGE" | "DOCUMENT";
  sourceId: string;
  kind: "TAG" | "NODE_LINK" | "EDGE" | "DECISION";
  payload: JsonRecord;
  confidence: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
};
