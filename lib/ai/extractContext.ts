import { contextExtractionSystemPrompt } from "./prompt";
import { fallbackExtractContext, type ExtractedContext, type ExistingNodeForExtraction } from "./fallbackExtractor";

export async function extractContext(params: {
  projectName: string;
  text: string;
  existingNodes: ExistingNodeForExtraction[];
  sourceNodeId?: string;
}): Promise<ExtractedContext> {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackExtractContext({
      text: params.text,
      existingNodes: params.existingNodes,
      sourceNodeId: params.sourceNodeId
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: contextExtractionSystemPrompt },
          {
            role: "user",
            content: JSON.stringify({
              projectName: params.projectName,
              existingNodes: params.existingNodes,
              sourceText: params.text
            })
          }
        ]
      })
    });
    if (!response.ok) {
      throw new Error(`OpenAI extraction failed: ${response.status}`);
    }
    const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI extraction returned no content");
    }
    return normalizeExtraction(JSON.parse(content));
  } catch {
    return fallbackExtractContext({
      text: params.text,
      existingNodes: params.existingNodes,
      sourceNodeId: params.sourceNodeId
    });
  }
}

function normalizeExtraction(input: unknown): ExtractedContext {
  const value = input as Partial<ExtractedContext>;
  return {
    suggestedTags: Array.isArray(value.suggestedTags) ? value.suggestedTags.slice(0, 8) : [],
    suggestedNodeLinks: Array.isArray(value.suggestedNodeLinks) ? value.suggestedNodeLinks.slice(0, 8) : [],
    suggestedEdges: Array.isArray(value.suggestedEdges) ? value.suggestedEdges.slice(0, 8) : [],
    suggestedDecision: value.suggestedDecision
  };
}
