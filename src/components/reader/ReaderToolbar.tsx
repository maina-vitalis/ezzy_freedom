"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FitMode } from "@/hooks/reader/useReaderControls";
import {
  Bookmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  List,
  Maximize2,
  Minimize2,
  Moon,
  Search,
  Sun,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Link from "next/link";

type ReaderToolbarProps = {
  title: string;
  currentPage: number;
  numPages: number;
  zoom: number;
  fitMode: FitMode;
  darkChrome: boolean;
  isFullscreen: boolean;
  isBookmarked: boolean;
  showBookmarks?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFit: () => void;
  onToggleTheme: () => void;
  onToggleFullscreen: () => void;
  onToggleBookmark: () => void;
  onOpenToc: () => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenThumbs: () => void;
  onClose?: () => void;
};

export default function ReaderToolbar({
  title,
  currentPage,
  numPages,
  zoom,
  fitMode,
  darkChrome,
  isFullscreen,
  isBookmarked,
  showBookmarks = true,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onToggleFit,
  onToggleTheme,
  onToggleFullscreen,
  onToggleBookmark,
  onOpenToc,
  onOpenSearch,
  onOpenBookmarks,
  onOpenThumbs,
  onClose,
}: ReaderToolbarProps) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-center gap-2 border-b px-3 py-2 backdrop-blur-md",
        darkChrome
          ? "border-white/10 bg-neutral-950/90 text-neutral-100"
          : "border-black/10 bg-white/90 text-neutral-900",
      )}
    >
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="rounded-full"
      >
        <Link href="/dashboard/library" onClick={onClose}>
          <X className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Library</span>
        </Link>
      </Button>

      <div className="min-w-0 flex-1 truncate px-2 text-sm font-medium">
        {title}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onPrev} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-16 text-center text-xs tabular-nums">
          {currentPage} / {numPages || "—"}
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onNext} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onZoomOut} aria-label="Zoom out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="w-10 text-center text-[11px] tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onZoomIn} aria-label="Zoom in">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs" onClick={onToggleFit}>
          {fitMode === "width" ? "Fit page" : "Fit width"}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onOpenToc} aria-label="Contents">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onOpenSearch} aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onOpenThumbs} aria-label="Thumbnails">
          <BookOpen className="h-4 w-4" />
        </Button>
        {showBookmarks && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onToggleBookmark}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-primary text-primary")} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs" onClick={onOpenBookmarks}>
              Marks
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onToggleTheme} aria-label="Toggle theme">
          {darkChrome ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onToggleFullscreen} aria-label="Fullscreen">
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
