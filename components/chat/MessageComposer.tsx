"use client";

import { useState } from "react";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalTextarea } from "@/components/brutal/BrutalTextarea";

export function MessageComposer({
  disabled,
  onSubmit
}: {
  disabled?: boolean;
  onSubmit: (content: string) => void;
}) {
  const [content, setContent] = useState("");
  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!content.trim() || disabled) return;
        onSubmit(content);
        setContent("");
      }}
    >
      <BrutalTextarea
        disabled={disabled}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={disabled ? "READ_ONLY_TIME_TRAVEL" : "Write with #tags or @node-title references"}
      />
      <BrutalButton variant="inverse" disabled={disabled || !content.trim()} type="submit">
        Send Message
      </BrutalButton>
    </form>
  );
}
