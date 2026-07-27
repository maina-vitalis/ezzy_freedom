"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Search, X } from "lucide-react";
import { useState } from "react";

type SearchHit = {
  pageNumber: number;
  snippet: string;
};

type SearchPanelProps = {
  pdf: PDFDocumentProxy;
  numPages: number;
  onJump: (page: number) => void;
  onClose: () => void;
};

export default function SearchPanel({
  pdf,
  numPages,
  onJump,
  onClose,
}: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [done, setDone] = useState(false);

  const runSearch = async () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    setSearching(true);
    setDone(false);
    setHits([]);
    const found: SearchHit[] = [];
    try {
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((it: any) => ("str" in it ? it.str : ""))
          .join(" ");
        const lower = text.toLowerCase();
        const idx = lower.indexOf(q);
        if (idx >= 0) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(text.length, idx + q.length + 40);
          found.push({
            pageNumber: i,
            snippet: `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`,
          });
        }
        if (found.length >= 50) break;
      }
      setHits(found);
    } finally {
      setSearching(false);
      setDone(true);
    }
  };

  return (
    <aside className="flex h-full w-80 flex-col border-l border-white/10 bg-neutral-950/95 text-neutral-100">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Search className="h-4 w-4 text-primary" />
          Search
        </h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2 border-b border-white/10 p-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find in book…"
          className="h-9 border-white/15 bg-white/5 text-neutral-100"
          onKeyDown={(e) => {
            if (e.key === "Enter") void runSearch();
          }}
        />
        <Button size="sm" className="rounded-full" onClick={() => void runSearch()} disabled={searching}>
          {searching ? "…" : "Go"}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {done && hits.length === 0 && (
          <p className="px-2 text-xs text-neutral-400">No matches found.</p>
        )}
        <ul className="space-y-1">
          {hits.map((hit, i) => (
            <li key={`${hit.pageNumber}-${i}`}>
              <button
                type="button"
                className="w-full rounded-md px-3 py-2 text-left hover:bg-white/5"
                onClick={() => onJump(hit.pageNumber)}
              >
                <div className="text-[11px] font-medium text-primary">
                  Page {hit.pageNumber}
                </div>
                <div className="line-clamp-2 text-xs text-neutral-300">
                  {hit.snippet}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
