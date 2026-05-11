import { describe, expect, it } from "vitest";
import { normalizeLibraryPath, resolveProjectLibraryPath } from "@/lib/files";

describe("local file library safety", () => {
  it("normalizes local project paths", () => {
    expect(normalizeLibraryPath("briefs\\launch-brief.md")).toBe("briefs/launch-brief.md");
    expect(normalizeLibraryPath("/research/context-loss-notes.txt")).toBe("research/context-loss-notes.txt");
  });

  it("rejects traversal paths", () => {
    expect(() => normalizeLibraryPath("../secrets.env")).toThrow("FILE_PATH_INVALID");
    expect(() => resolveProjectLibraryPath("project_demo", "briefs/../../secrets.env")).toThrow("FILE_PATH_INVALID");
  });
});
