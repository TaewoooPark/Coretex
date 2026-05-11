import type { HTMLAttributes, ReactNode } from "react";

export function BrutalPanel({
  title,
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { title?: ReactNode }) {
  return (
    <section className={["border-2 border-black bg-white shadow-hardSm", className].join(" ")} {...props}>
      {title ? <header className="border-b-2 border-black bg-[var(--color-surface-alt)] px-3 py-2 text-xs uppercase">{title}</header> : null}
      {children}
    </section>
  );
}
