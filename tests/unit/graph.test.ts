import { describe, expect, it } from "vitest";
import { resolveVersionAt, wouldCreateCycle } from "@/lib/graph";

describe("graph utilities", () => {
  it("detects cycles before adding a directed edge", () => {
    const edges = [
      { fromNodeId: "a", toNodeId: "b" },
      { fromNodeId: "b", toNodeId: "c" }
    ];
    expect(wouldCreateCycle({ edges, fromNodeId: "c", toNodeId: "a" })).toBe(true);
    expect(wouldCreateCycle({ edges, fromNodeId: "a", toNodeId: "c" })).toBe(false);
  });

  it("resolves latest version at timestamp", () => {
    const versions = [
      { versionNo: 1, createdAt: "2026-05-10T09:00:00.000Z" },
      { versionNo: 2, createdAt: "2026-05-10T09:20:00.000Z" },
      { versionNo: 3, createdAt: "2026-05-10T09:40:00.000Z" }
    ];
    expect(resolveVersionAt(versions, "2026-05-10T09:25:00.000Z")?.versionNo).toBe(2);
  });
});
