export function normalizeTag(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-_]/g, "");
}
