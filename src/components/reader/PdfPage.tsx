"use client";

import type { WatermarkInfo } from "@/hooks/reader/useBookAccess";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type PdfPageProps = {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  width: number;
  watermark: WatermarkInfo;
  active: boolean;
};

export type PdfPageHandle = HTMLDivElement;

function drawWatermarkToCanvas(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  watermark: WatermarkInfo,
) {
  // Lightweight watermark: email rendered into the canvas pixels.
  const email = watermark.email || watermark.name || "";
  if (!email) return;

  const orderText = watermark.orderId ? `#${watermark.orderId}` : "";
  const prefix = "Purchased:";
  const rawMain = `${prefix} ${email}`;
  const maxChars = Math.max(24, Math.round(canvasWidth / 28));
  const mainText =
    rawMain.length > maxChars ? `${rawMain.slice(0, Math.max(0, maxChars - 3))}...` : rawMain;

  const mainFontSize = Math.max(10, Math.round(canvasWidth / 35));
  const subFontSize = Math.max(9, Math.round(mainFontSize * 0.75));

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#111827"; // near-neutral-900
  ctx.textBaseline = "bottom";
  ctx.textAlign = "left";

  ctx.font = `600 ${mainFontSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;
  ctx.fillText(mainText, 18, canvasHeight - 18);

  if (orderText) {
    ctx.globalAlpha = 0.18;
    ctx.font = `500 ${subFontSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;
    ctx.fillText(orderText, 18, canvasHeight - 18 - Math.round(mainFontSize * 1.05));
  }

  ctx.restore();
}

const PdfPage = forwardRef<PdfPageHandle, PdfPageProps>(function PdfPage(
  { pdf, pageNumber, width, watermark, active },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [height, setHeight] = useState(Math.round(width * 1.414));

  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    let cancelled = false;
    let renderTask: { promise: Promise<unknown>; cancel?: () => void } | null = null;

    (async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;
        const unscaled = page.getViewport({ scale: 1 });
        const scale = width / unscaled.width;
        const viewport = page.getViewport({ scale });
        setHeight(viewport.height);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        renderTask = page.render({
          canvas,
          canvasContext: ctx,
          viewport,
        });

        await renderTask.promise;

        if (cancelled) return;
        drawWatermarkToCanvas(ctx, canvas.width, canvas.height, watermark);
      } catch (err) {
        console.error(`Failed to render page ${pageNumber}`, err);
      }
    })();

    return () => {
      cancelled = true;
      try {
        renderTask?.cancel?.();
      } catch {
        // ignore cancellation errors
      }
    };
  }, [pdf, pageNumber, width, active, watermark]);

  return (
    <div
      ref={rootRef}
      className="relative bg-[#f7f3ea] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
      style={{ width, height }}
      data-density="hard"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full select-none"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-neutral-500">
        {pageNumber}
      </span>
    </div>
  );
});

export default PdfPage;
