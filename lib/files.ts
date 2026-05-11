import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export type LocalFileEntry = {
  name: string;
  relativePath: string;
  kind: "FOLDER" | "FILE";
  depth: number;
  sizeBytes?: number;
  updatedAt?: string;
  importable: boolean;
};

export type ReadLocalFileResult = {
  name: string;
  relativePath: string;
  absolutePath: string;
  extension: string;
  sizeBytes: number;
  updatedAt: string;
  checksum: string;
  text: string;
};

const MAX_SCAN_DEPTH = 6;
const MAX_IMPORT_BYTES = 1024 * 1024;
const IMPORTABLE_EXTENSIONS = new Set([
  ".css",
  ".csv",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".markdown",
  ".prisma",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml"
]);

export function getLocalLibraryRoot() {
  return path.resolve(process.env.CORETEX_LOCAL_LIBRARY_ROOT ?? path.join(process.cwd(), "data", "local-library"));
}

export function getProjectLibraryRoot(projectId: string) {
  return path.join(getLocalLibraryRoot(), projectId);
}

export function normalizeLibraryPath(input: string) {
  const normalized = path.posix.normalize(input.replaceAll("\\", "/")).replace(/^\/+/, "");
  if (!normalized || normalized === "." || normalized.includes("\0") || normalized.startsWith("../") || normalized === "..") {
    throw new Error("FILE_PATH_INVALID");
  }
  return normalized;
}

export function resolveProjectLibraryPath(projectId: string, input: string) {
  const projectRoot = getProjectLibraryRoot(projectId);
  const relativePath = normalizeLibraryPath(input);
  const absolutePath = path.resolve(projectRoot, relativePath);
  const rootWithSeparator = projectRoot.endsWith(path.sep) ? projectRoot : `${projectRoot}${path.sep}`;
  if (absolutePath !== projectRoot && !absolutePath.startsWith(rootWithSeparator)) {
    throw new Error("FILE_PATH_INVALID");
  }
  return { projectRoot, relativePath, absolutePath };
}

export async function scanProjectLibrary(projectId: string): Promise<LocalFileEntry[]> {
  const projectRoot = getProjectLibraryRoot(projectId);
  const entries: LocalFileEntry[] = [];

  try {
    await fs.access(projectRoot);
  } catch {
    return entries;
  }

  async function walk(directory: string, depth: number) {
    if (depth > MAX_SCAN_DEPTH) return;
    const children = await fs.readdir(directory, { withFileTypes: true });
    children.sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    for (const child of children) {
      if (child.name.startsWith(".") || child.name === "node_modules") continue;
      const absolutePath = path.join(directory, child.name);
      const relativePath = path.relative(projectRoot, absolutePath).split(path.sep).join("/");
      const stat = await fs.stat(absolutePath);
      const kind = child.isDirectory() ? "FOLDER" : "FILE";
      entries.push({
        name: child.name,
        relativePath,
        kind,
        depth,
        sizeBytes: kind === "FILE" ? stat.size : undefined,
        updatedAt: stat.mtime.toISOString(),
        importable: kind === "FILE" && isImportablePath(relativePath) && stat.size <= MAX_IMPORT_BYTES
      });
      if (child.isDirectory()) {
        await walk(absolutePath, depth + 1);
      }
    }
  }

  await walk(projectRoot, 0);
  return entries;
}

export async function readImportableProjectFile(projectId: string, inputPath: string): Promise<ReadLocalFileResult> {
  const { relativePath, absolutePath } = resolveProjectLibraryPath(projectId, inputPath);
  const stat = await fs.stat(absolutePath);
  if (!stat.isFile()) {
    throw new Error("FILE_NOT_IMPORTABLE");
  }
  if (!isImportablePath(relativePath) || stat.size > MAX_IMPORT_BYTES) {
    throw new Error("FILE_NOT_IMPORTABLE");
  }
  const text = await fs.readFile(absolutePath, "utf8");
  return {
    name: path.basename(relativePath),
    relativePath,
    absolutePath,
    extension: path.extname(relativePath).toLowerCase(),
    sizeBytes: stat.size,
    updatedAt: stat.mtime.toISOString(),
    checksum: createHash("sha256").update(text).digest("hex"),
    text
  };
}

export function isImportablePath(relativePath: string) {
  return IMPORTABLE_EXTENSIONS.has(path.extname(relativePath).toLowerCase());
}

export function fileTextToTipTapDoc(file: Pick<ReadLocalFileResult, "name" | "relativePath" | "text">) {
  return {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: file.name }]
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: `SOURCE: ${file.relativePath}` }]
      },
      ...file.text
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .slice(0, 80)
        .map((paragraph) => ({
          type: "paragraph",
          content: [{ type: "text", text: paragraph }]
        }))
    ]
  };
}
