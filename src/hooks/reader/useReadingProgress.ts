"use client";

import { useCallback, useEffect, useRef } from "react";

export function useReadingProgress(bookId: string, currentPage: number) {
  const lastSaved = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    async (page: number) => {
      if (!bookId || page < 1 || page === lastSaved.current) return;
      lastSaved.current = page;
      try {
        await fetch(`/api/books/${bookId}/progress`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPage: page }),
        });
      } catch {
        // Non-blocking — progress is best-effort
      }
    },
    [bookId],
  );

  useEffect(() => {
    if (!bookId || currentPage < 1) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void save(currentPage);
    }, 4000);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [bookId, currentPage, save]);

  useEffect(() => {
    if (!bookId) return;
    const flush = () => {
      if (currentPage >= 1) void save(currentPage);
    };
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, [bookId, currentPage, save]);
}
