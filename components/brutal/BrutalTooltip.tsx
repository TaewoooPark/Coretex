import type { ReactNode } from "react";

export function BrutalTooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden whitespace-nowrap border border-black bg-white px-2 py-1 text-[11px] uppercase shadow-hardSm group-hover:block">
        {label}
      </span>
    </span>
  );
}
