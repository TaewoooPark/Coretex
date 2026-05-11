"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalInput } from "@/components/brutal/BrutalInput";
import { useVersionMutations } from "@/hooks/useNodeVersions";
import type { GraphNodeDTO } from "@/types/graph";

export function DocumentTab({ node, projectId, readOnly }: { node?: GraphNodeDTO; projectId: string; readOnly: boolean }) {
  const [changeSummary, setChangeSummary] = useState("");
  const mutations = useVersionMutations(node?.id, projectId);
  const editor = useEditor({
    extensions: [StarterKit],
    content: node?.content ?? { type: "doc", content: [{ type: "paragraph" }] },
    editable: Boolean(node) && !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-64 border-2 border-black bg-white p-3 text-sm leading-6 outline-none"
      }
    }
  });

  useEffect(() => {
    if (!editor || !node) return;
    editor.commands.setContent(node.content ?? { type: "doc", content: [{ type: "paragraph" }] });
    editor.setEditable(!readOnly);
  }, [editor, node, readOnly]);

  if (!node) {
    return <div className="p-4 text-xs uppercase text-[var(--color-muted)]">NO NODE SELECTED.</div>;
  }

  return (
    <div className="space-y-3 p-4">
      {readOnly ? <div className="border-2 border-black bg-black p-2 text-xs uppercase text-white">READ_ONLY_TIME_TRAVEL</div> : null}
      <EditorContent editor={editor} />
      <BrutalInput disabled={readOnly} value={changeSummary} onChange={(event) => setChangeSummary(event.target.value)} placeholder="Change summary" />
      <BrutalButton
        variant="inverse"
        disabled={readOnly || !editor}
        onClick={() => {
          if (!editor) return;
          mutations.saveVersion.mutate({
            title: node.title,
            content: editor.getJSON(),
            plainText: editor.getText(),
            changeSummary
          });
          setChangeSummary("");
        }}
      >
        Save Version
      </BrutalButton>
      {mutations.saveVersion.error ? <div className="border-2 border-black p-2 text-xs uppercase">{mutations.saveVersion.error.message}</div> : null}
    </div>
  );
}
