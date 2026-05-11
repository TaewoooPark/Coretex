import { z } from "zod";
import { edgeTypes, nodeStatuses, nodeTypes } from "@/types/node";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/)
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional()
});

export const positionSchema = z.object({
  x: z.number(),
  y: z.number()
});

export const createNodeSchema = z.object({
  title: z.string().trim().min(1).max(160),
  type: z.enum(nodeTypes),
  status: z.enum(nodeStatuses).optional(),
  summary: z.string().trim().max(600).optional(),
  content: z.record(z.unknown()).optional(),
  position: positionSchema.optional(),
  parentNodeId: z.string().optional(),
  edgeType: z.enum(edgeTypes).optional()
});

export const updateNodeSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  type: z.enum(nodeTypes).optional(),
  status: z.enum(nodeStatuses).optional(),
  summary: z.string().trim().max(600).optional(),
  position: positionSchema.optional(),
  metadata: z.record(z.unknown()).optional()
});

export const createEdgeSchema = z.object({
  fromNodeId: z.string().min(1),
  toNodeId: z.string().min(1),
  type: z.enum(edgeTypes),
  label: z.string().trim().max(80).optional()
});

export const createVersionSchema = z.object({
  title: z.string().trim().max(160).optional(),
  content: z.record(z.unknown()),
  plainText: z.string().optional(),
  changeSummary: z.string().trim().max(300).optional()
});

export const createMessageSchema = z.object({
  content: z.string().trim().min(1).max(2000),
  scopeNodeId: z.string().optional()
});

export const linkMessageSchema = z.object({
  nodeId: z.string().min(1),
  reason: z.string().trim().max(300).optional()
});

export const extractContextSchema = z.object({
  projectId: z.string(),
  sourceType: z.enum(["MESSAGE", "DOCUMENT"]),
  sourceId: z.string(),
  text: z.string()
});
