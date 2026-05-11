"use client";

import type { TextareaHTMLAttributes } from "react";

export function BrutalTextarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={[
        "min-h-24 w-full resize-none border-2 border-black bg-white px-2 py-2 text-sm outline-none",
        "focus:bg-black focus:text-white disabled:hatch disabled:cursor-not-allowed",
        className
      ].join(" ")}
      {...props}
    />
  );
}
