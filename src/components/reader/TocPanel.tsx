"use client";

import { Button } from "@/components/ui/button";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { List, X } from "lucide-react";
import { useEffect, useState } from "react";

type OutlineItem = {
  title: string;
  pageNumber: number | null;
  items?: OutlineItem[];
};

type TocPanelProps = {
  pdf: PDFDocumentProxy;
  onJump: (page: number) => void;
  onClose: () => void;
};

async function destToPage(
  pdf: PDFDocumentProxy,
  dest: unknown,
): Promise<number | null> {
  try {
    const explicit =
      typeof dest === "string" ? await pdf.getDestination(dest) : dest;
    if (!Array.isArray(explicit) || !explicit[0]) return null;
    const index = await pdf.getPageIndex(explicit[0]);
    return index + 1;
  } catch {
    return null;
  }
}

async function mapOutline(
  pdf: PDFDocumentProxy,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes: any[] | null | undefined,
): Promise<OutlineItem[]> {
  if (!nodes?.length) return [];
  const result: OutlineItem[] = [];
  for (const node of nodes) {
    const pageNumber = await destToPage(pdf, node.dest);
    result.push({
      title: node.title || "Untitled",
      pageNumber,
      items: await mapOutline(pdf, node.items),
    });
  }
  return result;
}

function OutlineTree({
  items,
  onJump,
  depth = 0,
}: {
  items: OutlineItem[];
  onJump: (page: number) => void;
  depth?: number;
}) {
  return (
    <ul className={depth ? "ml-3 border-l border-white/10" : ""}>
      {items.map((item, i) => (
        <li key={`${item.title}-${i}`}>
          <button
            type="button"
            disabled={!item.pageNumber}
            className="w-full truncate px-3 py-1.5 text-left text-sm hover:bg-white/5 disabled:opacity-40"
            style={{ paddingLeft: 12 + depth * 8 }}
            onClick={() => item.pageNumber && onJump(item.pageNumber)}
          >
            {item.title}
            {item.pageNumber ? (
              <span className="ml-2 text-[10px] text-neutral-500">
                p.{item.pageNumber}
              </span>
            ) : null}
          </button>
          {item.items && item.items.length > 0 && (
            <OutlineTree items={item.items} onJump={onJump} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function TocPanel({ pdf, onJump, onClose }: TocPanelProps) {
  const [items, setItems] = useState<OutlineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const outline = await pdf.getOutline();
        const mapped = await mapOutline(pdf, outline);
        if (!cancelled) setItems(mapped);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pdf]);

  return (
    <aside className="flex h-full w-72 flex-col border-l border-white/10 bg-neutral-950/95 text-neutral-100">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <List className="h-4 w-4 text-primary" />
          Contents
        </h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {loading && <p className="px-3 text-xs text-neutral-400">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="px-3 text-xs text-neutral-400">
            This PDF has no table of contents.
          </p>
        )}
        <OutlineTree items={items} onJump={onJump} />
      </div>
    </aside>
  );
}
