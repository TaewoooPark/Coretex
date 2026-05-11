import { normalizeTag } from "@/lib/tags";
import type { EdgeType, NodeType } from "@/types/node";

export type ExistingNodeForExtraction = {
  id: string;
  title: string;
  type: NodeType;
  summary?: string;
  tags: string[];
};

export type ExtractedContext = {
  suggestedTags: {
    name: string;
    confidence: number;
  }[];
  suggestedNodeLinks: {
    nodeId: string;
    confidence: number;
    reason: string;
  }[];
  suggestedEdges: {
    fromNodeId: string;
    toNodeId: string;
    type: EdgeType;
    confidence: number;
    reason: string;
  }[];
  suggestedDecision?: {
    statement: string;
    rationale?: string;
    confidence: number;
  };
};

export function fallbackExtractContext(params: {
  text: string;
  existingNodes: ExistingNodeForExtraction[];
  sourceNodeId?: string;
}): ExtractedContext {
  const text = params.text;
  const lowerText = text.toLowerCase();
  const tagMatches = [...text.matchAll(/(^|\s)#([a-zA-Z0-9가-힣_-]+)/g)];
  const suggestedTags = dedupe(
    tagMatches
      .map((match) => normalizeTag(match[2] ?? ""))
      .filter(Boolean)
      .map((name) => ({ name, confidence: 0.88 })),
    (item) => item.name
  );

  const explicitNodeMentions = [...text.matchAll(/@([a-zA-Z0-9가-힣][a-zA-Z0-9가-힣 _:-]{1,80})/g)].map((match) =>
    (match[1] ?? "").trim().toLowerCase()
  );

  const suggestedNodeLinks = dedupe(
    params.existingNodes
      .flatMap((node) => {
        const title = node.title.toLowerCase();
        const explicit = explicitNodeMentions.some((mention) => title.includes(mention) || mention.includes(title));
        const titleMention = lowerText.includes(title);
        if (explicit) {
          return [{ nodeId: node.id, confidence: 0.9, reason: "Explicit @node-title mention" }];
        }
        if (titleMention) {
          return [{ nodeId: node.id, confidence: 0.7, reason: "Existing node title appears in text" }];
        }
        return [];
      }),
    (item) => item.nodeId
  );

  const decisionPattern = /(decision|decided|conclusion|approved|approve|rejected|reject|final|confirmed|we will|we choose|we chose|결정|결론|확정|승인|반려)\s*[:：-]?\s*(.+)/i;
  const decisionMatch = text.match(decisionPattern);
  const suggestedDecision = decisionMatch
    ? {
        statement: (decisionMatch[2] ?? decisionMatch[0]).trim().slice(0, 240),
        confidence: 0.78
      }
    : undefined;

  const suggestedEdges =
    params.sourceNodeId && suggestedNodeLinks.length > 0
      ? suggestedNodeLinks
          .filter((link) => link.nodeId !== params.sourceNodeId)
          .slice(0, 3)
          .map((link) => ({
            fromNodeId: link.nodeId,
            toNodeId: params.sourceNodeId as string,
            type: "REFERENCES" as EdgeType,
            confidence: Math.min(0.76, link.confidence),
            reason: "Source node text references an existing node"
          }))
      : [];

  return {
    suggestedTags,
    suggestedNodeLinks,
    suggestedEdges,
    suggestedDecision
  };
}

function dedupe<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const itemKey = key(item);
    if (!seen.has(itemKey)) {
      seen.add(itemKey);
      result.push(item);
    }
  }
  return result;
}
