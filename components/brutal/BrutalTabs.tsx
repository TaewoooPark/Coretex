"use client";

import type { ReactNode } from "react";

export function BrutalTabs<T extends string>({
  tabs,
  active,
  onChange
}: {
  tabs: { id: T; label: string; content: ReactNode }[];
  active: T;
  onChange: (tab: T) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap border-b-2 border-black">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={[
              "border-r-2 border-black px-2 py-2 text-[11px] uppercase",
              active === tab.id ? "bg-black text-white" : "bg-white text-black hover:bg-[var(--color-surface-alt)]"
            ].join(" ")}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto brutal-scrollbar">{tabs.find((tab) => tab.id === active)?.content}</div>
    </div>
  );
}
