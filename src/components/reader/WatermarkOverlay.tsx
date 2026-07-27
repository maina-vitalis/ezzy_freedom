"use client";

import type { WatermarkInfo } from "@/hooks/reader/useBookAccess";

export default function WatermarkOverlay({
  watermark,
}: {
  watermark: WatermarkInfo;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none"
    >
      <div className="absolute left-1/2 top-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-[-28deg] text-center text-[11px] leading-relaxed text-foreground/15 sm:text-xs">
        <p className="font-semibold">Purchased by {watermark.name}</p>
        <p>{watermark.email}</p>
        <p>Order #{watermark.orderId}</p>
        <p>{watermark.date}</p>
      </div>
      <div className="absolute bottom-3 left-3 text-[9px] text-foreground/10">
        {watermark.email} · #{watermark.orderId}
      </div>
      <div className="absolute right-3 top-3 text-[9px] text-foreground/10">
        {watermark.name}
      </div>
    </div>
  );
}
