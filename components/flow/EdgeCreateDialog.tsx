"use client";

import { useState } from "react";
import { BrutalButton } from "@/components/brutal/BrutalButton";
import { BrutalDialog } from "@/components/brutal/BrutalDialog";
import { BrutalSelect } from "@/components/brutal/BrutalSelect";
import { edgeTypes, type EdgeType } from "@/types/node";

export function EdgeCreateDialog({
  open,
  onClose,
  onCreate
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (type: EdgeType) => void;
}) {
  const [type, setType] = useState<EdgeType>("DERIVES_FROM");
  return (
    <BrutalDialog open={open} title="Create Relationship" onClose={onClose}>
      <div className="space-y-3">
        <label className="block text-[11px] uppercase">Edge Type</label>
        <BrutalSelect value={type} onChange={(event) => setType(event.target.value as EdgeType)}>
          {edgeTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </BrutalSelect>
        <BrutalButton variant="inverse" onClick={() => onCreate(type)}>
          Create Edge
        </BrutalButton>
      </div>
    </BrutalDialog>
  );
}
