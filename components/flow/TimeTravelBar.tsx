"use client";

import { BrutalButton } from "@/components/brutal/BrutalButton";

export function TimeTravelBar({
  start,
  end,
  current,
  mode,
  onChange,
  onExit
}: {
  start: Date;
  end: Date;
  current: Date;
  mode: "CURRENT" | "TIME_TRAVEL";
  onChange: (date: Date) => void;
  onExit: () => void;
}) {
  const startMs = start.getTime();
  const endMs = end.getTime();
  const currentMs = Math.min(Math.max(current.getTime(), startMs), endMs);
  return (
    <div className={["flex items-center gap-3 border-t-4 border-black px-4 py-3", mode === "TIME_TRAVEL" ? "bg-black text-white" : "bg-white text-black"].join(" ")}>
      <div className="w-44 text-[11px] uppercase">
        {mode === "TIME_TRAVEL" ? "Viewing Past State" : "Current State"}
        <div className="mt-1 text-[10px] opacity-75">{new Date(currentMs).toISOString().slice(0, 16).replace("T", " ")}</div>
      </div>
      <input
        className="h-2 flex-1 accent-black"
        type="range"
        min={startMs}
        max={endMs}
        value={currentMs}
        onChange={(event) => onChange(new Date(Number(event.target.value)))}
      />
      <BrutalButton variant={mode === "TIME_TRAVEL" ? "inverse" : "default"} size="sm" onClick={onExit} disabled={mode === "CURRENT"}>
        Exit
      </BrutalButton>
    </div>
  );
}
