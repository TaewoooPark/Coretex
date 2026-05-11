"use client";

import { useEffect, useState } from "react";
import { BrutalInput } from "./BrutalInput";
import { BrutalDialog } from "./BrutalDialog";

type SearchResult = {
  type: "NODE" | "MESSAGE" | "TAG" | "DECISION";
  id: string;
  title: string;
  excerpt?: string;
};

export function BrutalCommandMenu({
  projectId,
  onResult
}: {
  projectId: string;
  onResult: (result: SearchResult) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open || !query.trim()) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/projects/${projectId}/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => {
        if (payload.ok) {
          setResults(payload.data.results);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [open, projectId, query]);

  return (
    <>
      <button className="border-2 border-black bg-white px-3 py-2 text-xs uppercase shadow-hardSm" onClick={() => setOpen(true)}>
        Search / Cmd K
      </button>
      <BrutalDialog open={open} title="Command Search" onClose={() => setOpen(false)}>
        <BrutalInput autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search nodes, tags, messages, decisions" />
        <div className="mt-4 max-h-80 overflow-auto brutal-scrollbar border-2 border-black">
          {results.length === 0 ? (
            <div className="p-3 text-xs uppercase text-[var(--color-muted)]">No results</div>
          ) : (
            results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                className="block w-full border-b border-black bg-white px-3 py-2 text-left hover:bg-black hover:text-white"
                onClick={() => {
                  onResult(result);
                  setOpen(false);
                }}
              >
                <div className="text-[11px] uppercase">{result.type}</div>
                <div className="text-sm">{result.title}</div>
                {result.excerpt ? <div className="mt-1 line-clamp-2 text-xs opacity-75">{result.excerpt}</div> : null}
              </button>
            ))
          )}
        </div>
      </BrutalDialog>
    </>
  );
}
