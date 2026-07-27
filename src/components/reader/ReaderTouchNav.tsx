"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef } from "react";

type ReaderTouchNavProps = {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  darkChrome?: boolean;
  children: React.ReactNode;
};

const SWIPE_THRESHOLD_PX = 48;
const SWIPE_MAX_VERTICAL_RATIO = 1.2;

/**
 * Mobile-friendly page navigation without flip animation:
 * - Tap left / right edge of the page area
 * - Horizontal swipe
 * - Large bottom prev/next controls on small screens
 *
 * Zero impact on PDF rendering / virtualization.
 */
export default function ReaderTouchNav({
  canPrev,
  canNext,
  onPrev,
  onNext,
  darkChrome = true,
  children,
}: ReaderTouchNavProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const goPrev = useCallback(() => {
    if (canPrev) onPrev();
  }, [canPrev, onPrev]);

  const goNext = useCallback(() => {
    if (canNext) onNext();
  }, [canNext, onNext]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    touchStart.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Horizontal swipe to turn page
    if (
      absDx >= SWIPE_THRESHOLD_PX &&
      absDx > absDy * SWIPE_MAX_VERTICAL_RATIO
    ) {
      swiped.current = true;
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  const onEdgeTap = (side: "prev" | "next") => {
    // Ignore if this was part of a swipe gesture
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    if (side === "prev") goPrev();
    else goNext();
  };

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          touchStart.current = null;
        }}
      >
        {children}

        {/* Invisible edge tap targets — Kindle-style */}
        <button
          type="button"
          aria-label="Previous page"
          disabled={!canPrev}
          className="absolute inset-y-0 left-0 z-20 w-[28%] cursor-w-resize border-0 bg-transparent disabled:cursor-default md:w-[22%]"
          onClick={() => onEdgeTap("prev")}
        />
        <button
          type="button"
          aria-label="Next page"
          disabled={!canNext}
          className="absolute inset-y-0 right-0 z-20 w-[28%] cursor-e-resize border-0 bg-transparent disabled:cursor-default md:w-[22%]"
          onClick={() => onEdgeTap("next")}
        />
      </div>

      {/* Large mobile bottom nav — hidden on desktop */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 border-t px-4 py-3 md:hidden",
          darkChrome
            ? "border-white/10 bg-neutral-950/95"
            : "border-black/10 bg-white/95",
        )}
      >
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="h-12 flex-1 rounded-full text-base"
          disabled={!canPrev}
          onClick={goPrev}
          aria-label="Previous page"
        >
          <ChevronLeft className="mr-1 h-5 w-5" />
          Prev
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="h-12 flex-1 rounded-full text-base"
          disabled={!canNext}
          onClick={goNext}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="ml-1 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
