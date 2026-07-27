"use client";

import { useEffect, useState } from "react";

/**
 * Page canvas width from viewport — prevents overscaled canvases on mobile
 * (major GPU/memory cost) and undersized pages on desktop.
 */
export function useReaderPageWidth(zoom: number, fitMode: "width" | "page") {
  const [viewportW, setViewportW] = useState(420);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      // Leave room for padding + optional side panel on larger screens.
      const usable = Math.max(280, Math.min(w - 32, fitMode === "width" ? 720 : 520));
      setViewportW(usable);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [fitMode]);

  return Math.round(viewportW * zoom);
}
