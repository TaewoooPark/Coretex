import { beforeEach, describe, expect, it } from "vitest";
import {
  createEdge,
  createMessage,
  createNode,
  createNodeFromMessage,
  createProject,
  createVersion,
  deleteNode,
  getGraph,
  importProjectFile,
  listProjectFiles,
  listProjects,
  searchProject
} from "@/lib/services";
import { DEMO_PROJECT_ID, DEMO_WORKSPACE_ID, getDb, resetDemoData } from "@/lib/mock-db";

describe("core API service integration", () => {
  beforeEach(() => {
    resetDemoData();
  });

  it("creates project with default nodes and edge", () => {
    const created = createProject(DEMO_WORKSPACE_ID, { name: "New Trace" });
    expect(created.ok).toBe(true);
    const projects = listProjects(DEMO_WORKSPACE_ID);
    expect(projects.ok && projects.data.projects.some((project) => project.name === "New Trace")).toBe(true);
  });

  it("creates node with version 1", async () => {
    const created = await createNode(DEMO_PROJECT_ID, { title: "New Decision", type: "DECISION" });
    expect(created.ok).toBe(true);
    const nodeId = created.ok ? created.data.node.id : "";
    expect(getDb().versions.some((version) => version.nodeId === nodeId && version.versionNo === 1)).toBe(true);
  });

  it("rejects cyclic edges", () => {
    const result = createEdge(DEMO_PROJECT_ID, {
      fromNodeId: "node_final",
      toNodeId: "node_idea",
      type: "REFERENCES"
    });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.code).toBe("CYCLE_NOT_ALLOWED");
  });

  it("creates messages and runs fallback extraction", async () => {
    const result = await createMessage(DEMO_PROJECT_ID, {
      content: "Decision: approve Project Brief for #launch"
    });
    expect(result.ok).toBe(true);
    expect(getDb().tags.some((tag) => tag.normalized === "launch")).toBe(true);
  });

  it("increments currentVersionNo on document save and extracts document context", async () => {
    const result = await createVersion("node_brief", {
      title: "Brief v3",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Updated" }] }] },
      plainText: "Updated #document-context",
      changeSummary: "Test save"
    });
    expect(result.ok).toBe(true);
    expect(getDb().nodes.find((node) => node.id === "node_brief")?.currentVersionNo).toBe(3);
    expect(getDb().nodeTags.some((item) => item.nodeId === "node_brief")).toBe(true);
  });

  it("creates a traceable node from a chat message", async () => {
    const message = await createMessage(DEMO_PROJECT_ID, {
      content: "Decision: approve the local file import path for #assets"
    });
    expect(message.ok).toBe(true);
    const result = await createNodeFromMessage(message.ok ? message.data.message.id : "");
    expect(result.ok).toBe(true);
    const nodeId = result.ok ? result.data.node.id : "";
    expect(getDb().messageNodeLinks.some((link) => link.nodeId === nodeId)).toBe(true);
    expect(getDb().decisions.some((decision) => decision.nodeId === nodeId)).toBe(true);
  });

  it("lists and imports local project files as ASSET nodes", async () => {
    const files = await listProjectFiles(DEMO_PROJECT_ID);
    expect(files.ok).toBe(true);
    expect(files.ok && files.data.files.some((file) => file.relativePath === "briefs/launch-brief.md")).toBe(true);

    const result = await importProjectFile(DEMO_PROJECT_ID, {
      path: "briefs/launch-brief.md",
      parentNodeId: "node_brief",
      edgeType: "REFERENCES"
    });
    expect(result.ok).toBe(true);
    const node = result.ok ? result.data.node : undefined;
    expect(node?.type).toBe("ASSET");
    expect(getDb().fileAssets.some((asset) => asset.importedNodeId === node?.id)).toBe(true);
    expect(getDb().edges.some((edge) => edge.fromNodeId === "node_brief" && edge.toNodeId === node?.id)).toBe(true);
  });

  it("searches document body text from saved versions", async () => {
    await createVersion("node_brief", {
      title: "Brief searchable",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Document body contains orbital-context-marker" }] }] },
      plainText: "Document body contains orbital-context-marker",
      changeSummary: "Search coverage"
    });
    const result = searchProject(DEMO_PROJECT_ID, "orbital-context-marker");
    expect(result.ok).toBe(true);
    expect(result.ok && result.data.results.some((item) => item.type === "NODE" && item.id === "node_brief")).toBe(true);
  });

  it("returns old state in time-travel graph query", () => {
    deleteNode("node_final");
    const current = getGraph(DEMO_PROJECT_ID);
    const past = getGraph(DEMO_PROJECT_ID, { at: "2026-05-10T09:49:00.000Z" });
    expect(current.ok && current.data.nodes.some((node) => node.id === "node_final")).toBe(false);
    expect(past.ok && past.data.nodes.some((node) => node.id === "node_final")).toBe(true);
  });

  it("uses historical document version content in time-travel graph query", () => {
    const past = getGraph(DEMO_PROJECT_ID, { at: "2026-05-10T09:08:00.000Z" });
    expect(past.ok).toBe(true);
    const brief = past.ok ? past.data.nodes.find((node) => node.id === "node_brief") : undefined;
    expect(brief?.currentVersionNo).toBe(1);
    expect(brief?.plainText).toBe("Nodes, edges, versions, chat.");
  });
});
