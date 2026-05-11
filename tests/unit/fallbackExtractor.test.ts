import { describe, expect, it } from "vitest";
import { fallbackExtractContext } from "@/lib/ai/fallbackExtractor";

describe("fallback extractor", () => {
  it("extracts tags, node links, and decision candidates without OpenAI", () => {
    const extraction = fallbackExtractContext({
      text: "Decision: approve @Project Brief for #mvp",
      existingNodes: [{ id: "node_brief", title: "Project Brief", type: "BRIEF", tags: [] }]
    });
    expect(extraction.suggestedTags[0]?.name).toBe("mvp");
    expect(extraction.suggestedNodeLinks[0]?.nodeId).toBe("node_brief");
    expect(extraction.suggestedDecision?.statement).toContain("approve");
  });
});
