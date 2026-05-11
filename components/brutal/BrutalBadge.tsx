import type { ReactNode } from "react";

export function BrutalBadge({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) {
  return (
    <span
      className={[
        "inline-flex border border-black px-1.5 py-0.5 text-[11px] uppercase leading-none",
        inverse ? "bg-black text-white" : "bg-white text-black"
      ].join(" ")}
    >
      {children}
    </span>
  );
}
