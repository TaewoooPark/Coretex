import { describe, expect, it } from "vitest";
import { getDb, resetDemoData } from "@/lib/mock-db";
import { createWorkspace } from "@/lib/services";
import { checkNodeLimit } from "@/lib/usage";

describe("usage guard", () => {
  it("blocks node creation at plan limit", () => {
    const db = resetDemoData();
    const billing = db.billingAccounts[0];
    billing.nodeLimit = db.nodes.length;
    expect(checkNodeLimit(getDb(), billing.workspaceId)).toEqual({
      ok: false,
      code: "PLAN_LIMIT_EXCEEDED",
      message: "This workspace has reached the node limit for the current plan."
    });
  });

  it("blocks extra workspace creation on the free plan", () => {
    resetDemoData();
    const result = createWorkspace({ name: "Extra", slug: "extra" });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.code).toBe("PLAN_LIMIT_EXCEEDED");
  });
});
