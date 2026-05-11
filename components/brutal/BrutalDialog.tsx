"use client";

import type { ReactNode } from "react";
import { BrutalButton } from "./BrutalButton";

export function BrutalDialog({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl border-4 border-black bg-white shadow-hardLg">
        <header className="flex items-center justify-between border-b-4 border-black bg-black px-4 py-3 text-white">
          <h2 className="text-sm uppercase">{title}</h2>
          <BrutalButton variant="inverse" size="sm" onClick={onClose}>
            Close
          </BrutalButton>
        </header>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
