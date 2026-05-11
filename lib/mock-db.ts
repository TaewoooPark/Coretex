import type {
  ActivityEvent,
  AiSuggestion,
  BillingAccount,
  ContextNode,
  Decision,
  DocumentVersion,
  Message,
  MessageNodeLink,
  MessageTag,
  NodeEdge,
  NodeTag,
  Project,
  ProjectArchive,
  ProjectFileAsset,
  SemanticTag,
  User,
  Workspace,
  WorkspaceMember
} from "@/types/node";

export type CoretexDb = {
  counters: Record<string, number>;
  users: User[];
  workspaces: Workspace[];
  workspaceMembers: WorkspaceMember[];
  billingAccounts: BillingAccount[];
  projects: Project[];
  nodes: ContextNode[];
  edges: NodeEdge[];
  versions: DocumentVersion[];
  messages: Message[];
  messageNodeLinks: MessageNodeLink[];
  tags: SemanticTag[];
  nodeTags: NodeTag[];
  messageTags: MessageTag[];
  decisions: Decision[];
  events: ActivityEvent[];
  archives: ProjectArchive[];
  fileAssets: ProjectFileAsset[];
  aiSuggestions: AiSuggestion[];
};

declare global {
  // eslint-disable-next-line no-var
  var __CORETEX_DB__: CoretexDb | undefined;
}

export const DEMO_USER_ID = "user_demo";
export const DEMO_WORKSPACE_ID = "workspace_demo";
export const DEMO_PROJECT_ID = "project_demo";

const iso = (minutes: number) =>
  new Date(Date.UTC(2026, 4, 10, 9, minutes, 0)).toISOString();

function makeEvent(
  index: number,
  projectId: string,
  type: ActivityEvent["type"],
  nodeId?: string,
  payload?: Record<string, unknown>
): ActivityEvent {
  return {
    id: `event_${index}`,
    projectId,
    nodeId,
    actorId: DEMO_USER_ID,
    type,
    payload,
    createdAt: iso(index * 5)
  };
}

export function createEmptyDb(): CoretexDb {
  return {
    counters: {},
    users: [],
    workspaces: [],
    workspaceMembers: [],
    billingAccounts: [],
    projects: [],
    nodes: [],
    edges: [],
    versions: [],
    messages: [],
    messageNodeLinks: [],
    tags: [],
    nodeTags: [],
    messageTags: [],
    decisions: [],
    events: [],
    archives: [],
    fileAssets: [],
    aiSuggestions: []
  };
}

export function nextId(db: CoretexDb, prefix: string): string {
  db.counters[prefix] = (db.counters[prefix] ?? 0) + 1;
  return `${prefix}_${db.counters[prefix]}`;
}

export function seedDemoData(): CoretexDb {
  const db = createEmptyDb();
  const now = iso(1);

  db.users.push({
    id: DEMO_USER_ID,
    email: "taewoo@example.com",
    name: "TAEWOO",
    createdAt: now,
    updatedAt: now
  });

  db.workspaces.push({
    id: DEMO_WORKSPACE_ID,
    name: "Coretex Demo Workspace",
    slug: "coretex-demo",
    createdAt: now,
    updatedAt: now
  });

  db.workspaceMembers.push({
    id: "member_demo",
    workspaceId: DEMO_WORKSPACE_ID,
    userId: DEMO_USER_ID,
    role: "OWNER",
    createdAt: now
  });

  db.billingAccounts.push({
    id: "billing_demo",
    workspaceId: DEMO_WORKSPACE_ID,
    plan: "FREE",
    nodeLimit: 100,
    storageLimitMb: 500,
    aiExtractionLimit: 100,
    aiExtractionCount: 6,
    createdAt: now,
    updatedAt: now
  });

  db.projects.push({
    id: DEMO_PROJECT_ID,
    workspaceId: DEMO_WORKSPACE_ID,
    name: "CORETEX MVP Launch",
    description: "A traceable flow for product direction, drafts, feedback, and final decisions.",
    status: "ACTIVE",
    createdAt: now,
    updatedAt: iso(48)
  });

  const nodes: ContextNode[] = [
    {
      id: "node_idea",
      projectId: DEMO_PROJECT_ID,
      title: "Initial Idea",
      type: "IDEA",
      status: "RAW",
      summary: "Replace linear folders with traceable work nodes.",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Start from graph-native collaboration." }] }] },
      positionX: 40,
      positionY: 90,
      createdById: DEMO_USER_ID,
      createdAt: iso(2),
      updatedAt: iso(3),
      currentVersionNo: 1
    },
    {
      id: "node_brief",
      projectId: DEMO_PROJECT_ID,
      title: "Project Brief",
      type: "BRIEF",
      status: "IN_PROGRESS",
      summary: "Define the MVP around traceable context, genealogy, and archive output.",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "CORETEX turns project work into a directed context graph." }] }] },
      positionX: 360,
      positionY: 40,
      createdById: DEMO_USER_ID,
      createdAt: iso(4),
      updatedAt: iso(16),
      currentVersionNo: 2
    },
    {
      id: "node_research",
      projectId: DEMO_PROJECT_ID,
      title: "Onboarding Research",
      type: "RESEARCH",
      status: "REVIEW",
      summary: "New teammates lose why-decisions across chat, docs, and review threads.",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Interview notes show context loss during handoff." }] }] },
      positionX: 700,
      positionY: 30,
      createdById: DEMO_USER_ID,
      createdAt: iso(9),
      updatedAt: iso(19),
      currentVersionNo: 2
    },
    {
      id: "node_draft",
      projectId: DEMO_PROJECT_ID,
      title: "Activation Draft",
      type: "DRAFT",
      status: "REVIEW",
      summary: "First flow draft combines graph canvas, inspector, and timeline.",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Canvas left, inspector right, time travel below." }] }] },
      positionX: 1020,
      positionY: 130,
      createdById: DEMO_USER_ID,
      createdAt: iso(18),
      updatedAt: iso(27),
      currentVersionNo: 2
    },
    {
      id: "node_feedback",
      projectId: DEMO_PROJECT_ID,
      title: "Stakeholder Feedback",
      type: "FEEDBACK",
      status: "DECIDED",
      summary: "Feedback asks for archive evidence and stricter DAG semantics.",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Archive must prove why the final output exists." }] }] },
      positionX: 1020,
      positionY: 420,
      createdById: DEMO_USER_ID,
      createdAt: iso(25),
      updatedAt: iso(32),
      currentVersionNo: 1
    },
    {
      id: "node_decision",
      projectId: DEMO_PROJECT_ID,
      title: "Decision: Guided Flow",
      type: "DECISION",
      status: "DECIDED",
      summary: "The MVP will prioritize guided traceability over freeform whiteboarding.",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Decision: Graph actions must preserve auditability." }] }] },
      positionX: 1360,
      positionY: 250,
      createdById: DEMO_USER_ID,
      createdAt: iso(36),
      updatedAt: iso(37),
      currentVersionNo: 1
    },
    {
      id: "node_final",
      projectId: DEMO_PROJECT_ID,
      title: "Final Output Blueprint",
      type: "FINAL",
      status: "FINALIZED",
      summary: "A launch blueprint derived from idea, research, draft, feedback, and decision nodes.",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Final output includes genealogy and archive readiness." }] }] },
      positionX: 1700,
      positionY: 250,
      createdById: DEMO_USER_ID,
      createdAt: iso(44),
      updatedAt: iso(48),
      currentVersionNo: 1
    }
  ];
  db.nodes.push(...nodes);

  db.edges.push(
    edge("edge_idea_brief", "node_idea", "node_brief", "SUPPORTS", 5),
    edge("edge_brief_research", "node_brief", "node_research", "DERIVES_FROM", 10),
    edge("edge_research_draft", "node_research", "node_draft", "SUPPORTS", 20),
    edge("edge_draft_feedback", "node_draft", "node_feedback", "REFINES", 26),
    edge("edge_feedback_decision", "node_feedback", "node_decision", "DECIDES", 36),
    edge("edge_decision_final", "node_decision", "node_final", "DERIVES_FROM", 45),
    edge("edge_draft_final", "node_draft", "node_final", "REFERENCES", 46)
  );

  db.versions.push(
    version("version_idea_1", "node_idea", 1, "Initial Idea", "Start from graph-native collaboration.", 3),
    version("version_brief_1", "node_brief", 1, "Project Brief v1", "Nodes, edges, versions, chat.", 5),
    version("version_brief_2", "node_brief", 2, "Project Brief v2", "Traceable Work Nodes and archive report added.", 16),
    version("version_research_1", "node_research", 1, "Research Notes", "Context loss appears in handoffs.", 12),
    version("version_research_2", "node_research", 2, "Research Notes v2", "Decision history and discarded alternatives are high-value.", 19),
    version("version_draft_1", "node_draft", 1, "Activation Draft", "Graph, inspector, timeline.", 22),
    version("version_draft_2", "node_draft", 2, "Activation Draft v2", "Add AI suggestions and manual message links.", 27),
    version("version_feedback_1", "node_feedback", 1, "Stakeholder Feedback", "Archive must include final outputs and rejected alternatives.", 25),
    version("version_decision_1", "node_decision", 1, "Guided Flow Decision", "Decision: preserve DAG semantics in every graph mutation.", 36),
    version("version_final_1", "node_final", 1, "Final Output Blueprint", "Blueprint derived from graph genealogy.", 44)
  );

  db.tags.push(
    tag("tag_context", "context"),
    tag("tag_archive", "archive"),
    tag("tag_onboarding", "onboarding"),
    tag("tag_decision", "decision"),
    tag("tag_mvp", "mvp")
  );

  db.nodeTags.push(
    nodeTag("nt_idea_context", "node_idea", "tag_context"),
    nodeTag("nt_brief_mvp", "node_brief", "tag_mvp"),
    nodeTag("nt_research_onboarding", "node_research", "tag_onboarding"),
    nodeTag("nt_feedback_archive", "node_feedback", "tag_archive"),
    nodeTag("nt_decision_decision", "node_decision", "tag_decision"),
    nodeTag("nt_final_archive", "node_final", "tag_archive")
  );

  db.messages.push(
    message("message_1", "We should link the Project Brief to #mvp and @Initial Idea so the origin is obvious.", 17),
    message("message_2", "Decision: guided graph editing beats a blank whiteboard for auditability.", 38),
    message("message_3", "Archive output needs Final Output Blueprint and Stakeholder Feedback together. #archive", 49)
  );

  db.messageNodeLinks.push(
    link("ml_1", "message_1", "node_idea", "MANUAL", 0.95, "Manual origin link"),
    link("ml_2", "message_1", "node_brief", "AI", 0.9, "Title mention"),
    link("ml_3", "message_2", "node_decision", "AI", 0.9, "Decision phrase"),
    link("ml_4", "message_3", "node_final", "AI", 0.9, "Title mention"),
    link("ml_5", "message_3", "node_feedback", "AI", 0.9, "Title mention")
  );

  db.messageTags.push(
    messageTag("mt_1", "message_1", "tag_mvp"),
    messageTag("mt_2", "message_3", "tag_archive")
  );

  db.decisions.push({
    id: "decision_guided_flow",
    nodeId: "node_decision",
    statement: "Guided graph editing is the MVP direction.",
    rationale: "It preserves traceability better than a generic whiteboard.",
    outcome: "Build constrained node, edge, version, chat, and archive flows.",
    decidedAt: iso(38),
    createdAt: iso(38)
  });

  db.aiSuggestions.push({
    id: "suggestion_archive_edge",
    projectId: DEMO_PROJECT_ID,
    sourceType: "MESSAGE",
    sourceId: "message_3",
    kind: "EDGE",
    payload: {
      fromNodeId: "node_feedback",
      toNodeId: "node_final",
      type: "SUPPORTS",
      reason: "Feedback explicitly asks the final blueprint to carry archive evidence."
    },
    confidence: 0.72,
    status: "PENDING",
    createdAt: iso(50)
  });

  db.events.push(
    makeEvent(1, DEMO_PROJECT_ID, "NODE_CREATED", "node_idea"),
    makeEvent(2, DEMO_PROJECT_ID, "NODE_CREATED", "node_brief"),
    makeEvent(3, DEMO_PROJECT_ID, "EDGE_CREATED", undefined, { edgeId: "edge_idea_brief" }),
    makeEvent(4, DEMO_PROJECT_ID, "VERSION_CREATED", "node_brief"),
    makeEvent(5, DEMO_PROJECT_ID, "NODE_CREATED", "node_research"),
    makeEvent(6, DEMO_PROJECT_ID, "EDGE_CREATED", undefined, { edgeId: "edge_brief_research" }),
    makeEvent(7, DEMO_PROJECT_ID, "NODE_CREATED", "node_draft"),
    makeEvent(8, DEMO_PROJECT_ID, "EDGE_CREATED", undefined, { edgeId: "edge_research_draft" }),
    makeEvent(9, DEMO_PROJECT_ID, "MESSAGE_CREATED", undefined, { messageId: "message_1" }),
    makeEvent(10, DEMO_PROJECT_ID, "VERSION_CREATED", "node_draft"),
    makeEvent(11, DEMO_PROJECT_ID, "NODE_CREATED", "node_feedback"),
    makeEvent(12, DEMO_PROJECT_ID, "EDGE_CREATED", undefined, { edgeId: "edge_draft_feedback" }),
    makeEvent(13, DEMO_PROJECT_ID, "NODE_CREATED", "node_decision"),
    makeEvent(14, DEMO_PROJECT_ID, "DECISION_CREATED", "node_decision"),
    makeEvent(15, DEMO_PROJECT_ID, "NODE_CREATED", "node_final"),
    makeEvent(16, DEMO_PROJECT_ID, "EDGE_CREATED", undefined, { edgeId: "edge_decision_final" }),
    makeEvent(17, DEMO_PROJECT_ID, "MESSAGE_CREATED", undefined, { messageId: "message_3" })
  );

  db.counters = {
    workspace: 1,
    project: 1,
    node: 7,
    edge: 7,
    version: 10,
    message: 3,
    tag: 5,
    event: 17,
    archive: 0,
    suggestion: 1,
    link: 5
  };

  return db;

  function edge(id: string, fromNodeId: string, toNodeId: string, type: NodeEdge["type"], minute: number): NodeEdge {
    return {
      id,
      projectId: DEMO_PROJECT_ID,
      fromNodeId,
      toNodeId,
      type,
      weight: 1,
      createdAt: iso(minute),
      updatedAt: iso(minute)
    };
  }

  function version(id: string, nodeId: string, versionNo: number, title: string, plainText: string, minute: number): DocumentVersion {
    return {
      id,
      nodeId,
      versionNo,
      title,
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: plainText }] }] },
      plainText,
      changeSummary: versionNo === 1 ? "Initial version" : "Updated context",
      createdById: DEMO_USER_ID,
      createdAt: iso(minute)
    };
  }

  function tag(id: string, normalized: string): SemanticTag {
    return {
      id,
      projectId: DEMO_PROJECT_ID,
      name: normalized,
      normalized,
      createdAt: iso(14)
    };
  }

  function nodeTag(id: string, nodeId: string, tagId: string): NodeTag {
    return {
      id,
      nodeId,
      tagId,
      source: "MANUAL",
      confidence: 1,
      createdAt: iso(15)
    };
  }

  function message(id: string, content: string, minute: number): Message {
    return {
      id,
      projectId: DEMO_PROJECT_ID,
      authorId: DEMO_USER_ID,
      content,
      aiProcessed: true,
      createdAt: iso(minute),
      updatedAt: iso(minute)
    };
  }

  function link(
    id: string,
    messageId: string,
    nodeId: string,
    source: MessageNodeLink["source"],
    confidence: number,
    reason: string
  ): MessageNodeLink {
    return {
      id,
      messageId,
      nodeId,
      source,
      confidence,
      reason,
      createdAt: iso(50)
    };
  }

  function messageTag(id: string, messageId: string, tagId: string): MessageTag {
    return {
      id,
      messageId,
      tagId,
      source: "AI",
      confidence: 0.9,
      createdAt: iso(50)
    };
  }
}

export function getDb(): CoretexDb {
  if (!globalThis.__CORETEX_DB__) {
    globalThis.__CORETEX_DB__ = seedDemoData();
  }
  ensureDbShape(globalThis.__CORETEX_DB__);
  return globalThis.__CORETEX_DB__;
}

export function resetDemoData(): CoretexDb {
  globalThis.__CORETEX_DB__ = seedDemoData();
  return globalThis.__CORETEX_DB__;
}

function ensureDbShape(db: CoretexDb) {
  db.fileAssets ??= [];
  db.aiSuggestions ??= [];
}
