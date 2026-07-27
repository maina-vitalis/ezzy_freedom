"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";

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

function yieldToMain() {
  return new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: 50 });
    } else {
      setTimeout(resolve, 0);
    }
  });
}

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
  const [scanned, setScanned] = useState(0);
  const cancelRef = useRef(false);

  const runSearch = async () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    cancelRef.current = false;
    setSearching(true);
    setDone(false);
    setHits([]);
    setScanned(0);
    const found: SearchHit[] = [];
    try {
      for (let i = 1; i <= numPages; i++) {
        if (cancelRef.current) break;
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
        if (i % 4 === 0) {
          setScanned(i);
          setHits([...found]);
          await yieldToMain();
        }
        if (found.length >= 50) break;
      }
      setHits(found);
      setScanned(numPages);
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
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            cancelRef.current = true;
            onClose();
          }}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2 border-b border-white/10 p-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void runSearch();
          }}
          placeholder="Find in book…"
          className="h-9 bg-white/5"
        />
        <Button
          size="sm"
          className="rounded-full"
          disabled={searching || !query.trim()}
          onClick={() => void runSearch()}
        >
          {searching ? "…" : "Go"}
        </Button>
      </div>
      {searching && (
        <p className="px-3 py-2 text-xs text-neutral-400">
          Scanning page {scanned}/{numPages}…
        </p>
      )}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {done && hits.length === 0 && (
          <p className="text-sm text-neutral-400">No matches found.</p>
        )}
        {hits.map((hit) => (
          <button
            key={`${hit.pageNumber}-${hit.snippet.slice(0, 12)}`}
            type="button"
            onClick={() => onJump(hit.pageNumber)}
            className="block w-full rounded-md border border-white/10 p-2 text-left text-sm hover:border-primary/40"
          >
            <span className="text-xs text-primary">Page {hit.pageNumber}</span>
            <p className="mt-1 text-neutral-300">{hit.snippet}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}
