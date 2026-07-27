"use client";

import { useCallback, useEffect, useState } from "react";

export type FitMode = "width" | "page";

export function useReaderControls() {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [fitMode, setFitMode] = useState<FitMode>("page");
  const [darkChrome, setDarkChrome] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panel, setPanel] = useState<
    "none" | "toc" | "search" | "bookmarks" | "thumbs"
  >("none");

  const togglePanel = useCallback(
    (next: typeof panel) => {
      setPanel((prev) => (prev === next ? "none" : next));
    },
    [],
  );

  const toggleFullscreen = useCallback(async (el?: HTMLElement | null) => {
    try {
      if (!document.fullscreenElement) {
        await (el ?? document.documentElement).requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen may be blocked by browser policy
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2))), []);
  const resetZoom = useCallback(() => setZoom(1), []);

  return {
    currentPage,
    setCurrentPage,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    fitMode,
    setFitMode,
    darkChrome,
    setDarkChrome,
    isFullscreen,
    toggleFullscreen,
    panel,
    setPanel,
    togglePanel,
  };
}
