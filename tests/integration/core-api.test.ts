import { beforeEach, describe, expect, it } from "vitest";
import { createEdge, createMessage, createNode, createProject, createVersion, deleteNode, getGraph, listProjects } from "@/lib/services";
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

  it("increments currentVersionNo on document save", () => {
    const result = createVersion("node_brief", {
      title: "Brief v3",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Updated" }] }] },
      plainText: "Updated",
      changeSummary: "Test save"
    });
    expect(result.ok).toBe(true);
    expect(getDb().nodes.find((node) => node.id === "node_brief")?.currentVersionNo).toBe(3);
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
