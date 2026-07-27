"use client";

import { Button } from "@/components/ui/button";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { LayoutGrid, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ThumbnailPanelProps = {
  pdf: PDFDocumentProxy;
  numPages: number;
  currentPage: number;
  onJump: (page: number) => void;
  onClose: () => void;
};

function Thumb({
  pdf,
  pageNumber,
  active,
  onJump,
}: {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  active: boolean;
  onJump: (page: number) => void;
}) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisible(true);
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled || !canvasRef.current) return;
        const viewport = page.getViewport({ scale: 0.18 });
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        if (!cancelled) setReady(true);
      } catch {
        // ignore thumb failures
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pdf, pageNumber, visible]);

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={() => onJump(pageNumber)}
      className={`rounded-md border p-1 transition ${
        active
          ? "border-primary bg-primary/10"
          : "border-white/10 hover:border-white/30"
      }`}
    >
      <div className="mx-auto aspect-3/4 w-full bg-neutral-800/50">
        <canvas
          ref={canvasRef}
          className={`mx-auto block max-w-full ${ready ? "opacity-100" : "opacity-30"}`}
        />
      </div>
      <span className="mt-1 block text-center text-[10px] text-neutral-400">
        {pageNumber}
      </span>
    </button>
  );
}

export default function ThumbnailPanel({
  pdf,
  numPages,
  currentPage,
  onJump,
  onClose,
}: ThumbnailPanelProps) {
  // Smaller window; lazy-render via IntersectionObserver inside Thumb.
  const start = Math.max(1, currentPage - 6);
  const end = Math.min(numPages, currentPage + 6);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <aside className="flex h-full w-56 flex-col border-l border-white/10 bg-neutral-950/95 text-neutral-100">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <LayoutGrid className="h-4 w-4 text-primary" />
          Pages
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto p-2">
        {pages.map((n) => (
          <Thumb
            key={n}
            pdf={pdf}
            pageNumber={n}
            active={n === currentPage}
            onJump={onJump}
          />
        ))}
      </div>
    </aside>
  );
}
