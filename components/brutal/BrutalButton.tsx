"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type BrutalButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "inverse" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

const variantClass = {
  default: "bg-white text-black border-2 border-black shadow-hardSm hover:shadow-hardMd",
  inverse: "bg-black text-white border-2 border-black shadow-hardSm hover:shadow-hardMd",
  ghost: "bg-transparent text-black border-b-2 border-black hover:bg-black hover:text-white",
  danger:
    "bg-white text-black border-2 border-black shadow-hardSm hover:shadow-hardMd hatch"
};

const sizeClass = {
  sm: "px-2 py-1 text-[11px]",
  md: "px-3 py-2 text-xs",
  lg: "px-4 py-3 text-sm"
};

export function BrutalButton({ variant = "default", size = "md", className = "", children, ...props }: BrutalButtonProps) {
  return (
    <button
      className={[
        "inline-flex min-h-8 items-center justify-center gap-2 uppercase tracking-normal transition-[box-shadow,transform] disabled:hatch disabled:cursor-not-allowed",
        "disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-70",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        variantClass[variant],
        sizeClass[size],
        className
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
