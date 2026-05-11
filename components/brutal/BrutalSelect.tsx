"use client";

import type { SelectHTMLAttributes } from "react";

export function BrutalSelect({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={[
        "min-h-9 w-full border-2 border-black bg-white px-2 py-1 text-xs uppercase outline-none",
        "focus:bg-black focus:text-white disabled:hatch disabled:cursor-not-allowed",
        className
      ].join(" ")}
      {...props}
    />
  );
}
