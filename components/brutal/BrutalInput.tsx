"use client";

import type { InputHTMLAttributes } from "react";

export function BrutalInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "min-h-9 w-full border-2 border-black bg-white px-2 py-1 text-sm outline-none",
        "focus:bg-black focus:text-white disabled:hatch disabled:cursor-not-allowed",
        className
      ].join(" ")}
      {...props}
    />
  );
}
