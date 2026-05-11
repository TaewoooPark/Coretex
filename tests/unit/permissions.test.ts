import { describe, expect, it } from "vitest";
import { canMutate, hasRoleAtLeast } from "@/lib/permissions";

describe("permission checks", () => {
  it("blocks viewer mutations and ranks roles", () => {
    expect(canMutate("VIEWER")).toBe(false);
    expect(canMutate("MEMBER")).toBe(true);
    expect(hasRoleAtLeast("ADMIN", "MEMBER")).toBe(true);
  });
});
