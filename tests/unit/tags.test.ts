import { describe, expect, it } from "vitest";
import { normalizeTag } from "@/lib/tags";

describe("tag normalization", () => {
  it("normalizes hashtag input", () => {
    expect(normalizeTag(" #Launch Plan! ")).toBe("launch-plan");
    expect(normalizeTag("#의사결정")).toBe("의사결정");
  });
});
