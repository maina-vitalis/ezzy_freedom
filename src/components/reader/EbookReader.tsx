"use client";

import BookmarkPanel from "@/components/reader/BookmarkPanel";
import LoadingScreen from "@/components/reader/LoadingScreen";
import ReaderError from "@/components/reader/ReaderError";
import ReaderToolbar from "@/components/reader/ReaderToolbar";
import PdfPage from "@/components/reader/PdfPage";
import SearchPanel from "@/components/reader/SearchPanel";
import ThumbnailPanel from "@/components/reader/ThumbnailPanel";
import TocPanel from "@/components/reader/TocPanel";
import {
  useBookAccess,
  type ReaderContentType,
} from "@/hooks/reader/useBookAccess";
import { useBookmarks } from "@/hooks/reader/useBookmarks";
import { usePdfDocument } from "@/hooks/reader/usePdfDocument";
import { useReaderControls } from "@/hooks/reader/useReaderControls";
import { useReadingProgress } from "@/hooks/reader/useReadingProgress";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef } from "react";

type EbookReaderProps = {
  contentId: string;
  contentType?: ReaderContentType;
  initialTitle?: string;
  contentSlug?: string;
};

export default function EbookReader({
  contentId,
  contentType = "book",
  initialTitle,
  contentSlug,
}: EbookReaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const access = useBookAccess(contentId, contentType);
  const isBook = contentType === "book";
  const bookmarks = useBookmarks(isBook ? contentId : "");
  const {
    currentPage,
    setCurrentPage,
    zoom,
    zoomIn,
    zoomOut,
    fitMode,
    setFitMode,
    darkChrome,
    setDarkChrome,
    isFullscreen,
    toggleFullscreen,
    panel,
    setPanel,
    togglePanel,
  } = useReaderControls();

  const fileUrl = access.data
    ? contentType === "article"
      ? `/api/articles/${contentId}/file`
      : `/api/books/${contentId}/file`
    : null;
  const pdfState = usePdfDocument({
    fileUrl,
    onFileAuthExpired: access.refresh,
  });

  // Seed current page once access loads
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current || !access.data) return;
    setCurrentPage(access.data.progress.currentPage || 1);
    seeded.current = true;
  }, [access.data, setCurrentPage]);

  // Clamp once we know the real document length.
  useEffect(() => {
    if (!pdfState.numPages) return;
    if (currentPage <= pdfState.numPages) return;
    setCurrentPage(pdfState.numPages);
  }, [pdfState.numPages, currentPage, setCurrentPage]);

  useReadingProgress(isBook ? contentId : "", currentPage);

  const pageSize = useMemo(() => {
    const baseW = fitMode === "width" ? 520 : 420;
    const w = Math.round(baseW * zoom);
    return { width: w };
  }, [fitMode, zoom]);

  const jumpToPage = useCallback(
    (pageOneBased: number) => {
      const max = pdfState.numPages || pageOneBased;
      const target = Math.max(1, Math.min(pageOneBased, max));
      setCurrentPage(target);
      setPanel("none");
    },
    [pdfState.numPages, setCurrentPage, setPanel],
  );

  const bufferedPageNumbers = useMemo(() => {
    if (!pdfState.pdf || pdfState.numPages < 1) return [];
    const desired = [
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
    const uniq = Array.from(new Set(desired)).filter(
      (p) => p >= 1 && p <= pdfState.numPages,
    );
    uniq.sort((a, b) => a - b);
    return uniq;
  }, [currentPage, pdfState.numPages, pdfState.pdf]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentPage((p) => {
          const max = pdfState.numPages || Number.POSITIVE_INFINITY;
          return Math.min(max, p + 1);
        });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentPage((p) => Math.max(1, p - 1));
      } else if (e.key === "Escape" && panel !== "none") {
        setPanel("none");
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, setCurrentPage, setPanel, pdfState.numPages]);

  const loading = access.loading || (pdfState.loading && !pdfState.pdf);

  if (access.error && !access.data) {
    return (
      <ReaderError
        status={access.status}
        message={access.error}
        contentSlug={contentSlug}
        contentType={contentType}
        onRetry={() => void access.refresh()}
      />
    );
  }

  if (loading) {
    return (
      <LoadingScreen
        message={
          contentType === "article"
            ? "Opening your article…"
            : "Opening your ebook…"
        }
      />
    );
  }

  if (pdfState.error) {
    return (
      <ReaderError
        message={pdfState.error}
        onRetry={() => void access.refresh()}
        contentSlug={contentSlug}
        contentType={contentType}
      />
    );
  }

  if (!access.data || !pdfState.pdf) {
    return <LoadingScreen />;
  }

  const pdf = pdfState.pdf;
  const watermark = access.data.watermark;

  const title =
    access.data.book.title ||
    initialTitle ||
    (contentType === "article" ? "Article" : "Ebook");
  const bookmarked = isBook ? bookmarks.isBookmarked(currentPage) : false;

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex h-dvh flex-col select-none",
        darkChrome
          ? "bg-neutral-950 text-neutral-100"
          : "bg-neutral-100 text-neutral-900",
      )}
      onContextMenu={(e) => e.preventDefault()}
    >
      <ReaderToolbar
        title={title}
        currentPage={currentPage}
        numPages={pdfState.numPages}
        zoom={zoom}
        fitMode={fitMode}
        darkChrome={darkChrome}
        isFullscreen={isFullscreen}
        isBookmarked={bookmarked}
        showBookmarks={isBook}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() =>
          setCurrentPage((p) => {
            const max = pdfState.numPages || p + 1;
            return Math.min(max, p + 1);
          })
        }
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onToggleFit={() =>
          setFitMode((m) => (m === "page" ? "width" : "page"))
        }
        onToggleTheme={() => setDarkChrome((d) => !d)}
        onToggleFullscreen={() => void toggleFullscreen(rootRef.current)}
        onToggleBookmark={() => {
          if (isBook) void bookmarks.toggleBookmark(currentPage);
        }}
        onOpenToc={() => togglePanel("toc")}
        onOpenSearch={() => togglePanel("search")}
        onOpenBookmarks={() => {
          if (isBook) togglePanel("bookmarks");
        }}
        onOpenThumbs={() => togglePanel("thumbs")}
      />

      <div className="relative flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden p-4 md:p-8">
          <div className="relative">
            {bufferedPageNumbers.map((pageNumber) => {
              const isCurrent = pageNumber === currentPage;
              return (
                <div
                  key={pageNumber}
                  className={cn(
                    !isCurrent &&
                      "pointer-events-none absolute left-[-10000px] top-0",
                  )}
                >
                  <PdfPage
                    pdf={pdf}
                    pageNumber={pageNumber}
                    width={pageSize.width}
                    watermark={watermark}
                    active
                  />
                </div>
              );
            })}
          </div>
        </div>

        {panel === "toc" && (
          <TocPanel
            pdf={pdfState.pdf}
            onJump={jumpToPage}
            onClose={() => setPanel("none")}
          />
        )}
        {panel === "search" && (
          <SearchPanel
            pdf={pdfState.pdf}
            numPages={pdfState.numPages}
            onJump={jumpToPage}
            onClose={() => setPanel("none")}
          />
        )}
        {panel === "bookmarks" && isBook && (
          <BookmarkPanel
            bookmarks={bookmarks.bookmarks}
            loading={bookmarks.loading}
            onJump={jumpToPage}
            onRemove={(p) => void bookmarks.removeBookmark(p)}
            onClose={() => setPanel("none")}
          />
        )}
        {panel === "thumbs" && (
          <ThumbnailPanel
            pdf={pdfState.pdf}
            numPages={pdfState.numPages}
            currentPage={currentPage}
            onJump={jumpToPage}
            onClose={() => setPanel("none")}
          />
        )}
      </div>
    </div>
  );
}
