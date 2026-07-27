"use client";

import PdfPage from "@/components/reader/PdfPage";
import type { WatermarkInfo } from "@/hooks/reader/useBookAccess";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import HTMLFlipBook from "react-pageflip";

type PageFlipApi = {
  flipNext: () => void;
  flipPrev: () => void;
  turnToPage: (n: number) => void;
  flip: (n: number) => void;
  getCurrentPageIndex: () => number;
};

type FlipBookRef = {
  pageFlip: () => PageFlipApi | undefined;
};

export type FlipBookHandle = {
  flipNext: () => void;
  flipPrev: () => void;
  turnToPage: (pageIndexZeroBased: number) => void;
  getCurrentPageIndex: () => number;
};

type FlipBookProps = {
  pdf: PDFDocumentProxy;
  numPages: number;
  pageWidth: number;
  pageHeight: number;
  watermark: WatermarkInfo;
  startPage: number;
  currentPage: number;
  onPageChange: (pageOneBased: number) => void;
};

const RENDER_RADIUS = 2;

function getFlip(ref: React.RefObject<FlipBookRef | null>) {
  return ref.current?.pageFlip?.();
}

const FlipBook = forwardRef<FlipBookHandle, FlipBookProps>(function FlipBook(
  {
    pdf,
    numPages,
    pageWidth,
    pageHeight,
    watermark,
    startPage,
    currentPage,
    onPageChange,
  },
  ref,
) {
  const bookRef = useRef<FlipBookRef | null>(null);
  const startIndex = Math.max(0, Math.min(numPages - 1, startPage - 1));
  const didRestore = useRef(false);

  const pages = useMemo(
    () => Array.from({ length: numPages }, (_, i) => i + 1),
    [numPages],
  );

  useImperativeHandle(ref, () => ({
    flipNext: () => getFlip(bookRef)?.flipNext(),
    flipPrev: () => getFlip(bookRef)?.flipPrev(),
    turnToPage: (pageIndexZeroBased: number) =>
      getFlip(bookRef)?.turnToPage(pageIndexZeroBased),
    getCurrentPageIndex: () => getFlip(bookRef)?.getCurrentPageIndex() ?? 0,
  }));

  const handleFlip = useCallback(
    (e: { data: number }) => {
      onPageChange(e.data + 1);
    },
    [onPageChange],
  );

  /** PageFlip is only available after `init` — restore progress here, not in useEffect. */
  const handleInit = useCallback(
    (e: { data: { page: number } }) => {
      if (didRestore.current) return;
      didRestore.current = true;

      const flip = getFlip(bookRef);
      if (flip && startIndex > 0) {
        flip.turnToPage(startIndex);
        onPageChange(startIndex + 1);
        return;
      }

      onPageChange((e.data?.page ?? 0) + 1);
    },
    [onPageChange, startIndex],
  );

  if (numPages < 1) return null;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <HTMLFlipBook
      ref={bookRef as any}
      width={pageWidth}
      height={pageHeight}
      size="stretch"
      minWidth={280}
      maxWidth={900}
      minHeight={360}
      maxHeight={1200}
      drawShadow
      flippingTime={700}
      usePortrait
      startZIndex={0}
      autoSize
      maxShadowOpacity={0.45}
      showCover
      mobileScrollSupport
      clickEventForward={false}
      useMouseEvents
      swipeDistance={30}
      showPageCorners
      disableFlipByClick={false}
      startPage={startIndex}
      className="mx-auto shadow-2xl"
      style={{}}
      onFlip={handleFlip}
      onInit={handleInit}
      renderOnlyPageLengthChange
    >
      {pages.map((pageNumber) => (
        <PdfPage
          key={pageNumber}
          pdf={pdf}
          pageNumber={pageNumber}
          width={pageWidth}
          watermark={watermark}
          active={Math.abs(pageNumber - currentPage) <= RENDER_RADIUS}
        />
      ))}
    </HTMLFlipBook>
  );
});

export default FlipBook;
