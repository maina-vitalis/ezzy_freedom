"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ReaderContentType = "book" | "article";

export type WatermarkInfo = {
  name: string;
  email: string;
  orderId: string;
  date: string;
};

export type BookAccessPayload = {
  book: {
    id: string;
    title: string;
    slug: string;
    coverImage: string;
  };
  watermark: WatermarkInfo;
  progress: {
    currentPage: number;
    lastRead: string | null;
  };
};

type UseBookAccessState = {
  data: BookAccessPayload | null;
  loading: boolean;
  error: string | null;
  status: number | null;
  refresh: () => Promise<BookAccessPayload | null>;
};

/**
 * Fetches entitlement + reader metadata for a book or article.
 */
export function useBookAccess(
  contentId: string,
  contentType: ReaderContentType = "book",
): UseBookAccessState {
  const [data, setData] = useState<BookAccessPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const mountedRef = useRef(true);

  const fetchAccess = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const path =
        contentType === "article"
          ? `/api/articles/${contentId}/access`
          : `/api/books/${contentId}/access`;

      const res = await fetch(path, {
        // Metadata is user-specific; the server marks it `private` and short-lived.
        cache: "default",
      });
      setStatus(res.status);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw Object.assign(
          new Error(body.error || "Unable to open document"),
          { status: res.status },
        );
      }

      const payload = (await res.json()) as BookAccessPayload;
      if (!mountedRef.current) return null;
      setData(payload);
      setError(null);

      return payload;
    } catch (err: unknown) {
      if (!mountedRef.current) return null;
      const message =
        err instanceof Error ? err.message : "Unable to open document";
      setError(message);
      setData(null);
      return null;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [contentId, contentType]);

  useEffect(() => {
    mountedRef.current = true;
    const t = setTimeout(() => {
      void fetchAccess();
    }, 0);
    return () => {
      mountedRef.current = false;
      clearTimeout(t);
    };
  }, [fetchAccess]);

  return { data, loading, error, status, refresh: fetchAccess };
}
