"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
 * Fetches entitlement + reader metadata.
 */
export function useBookAccess(bookId: string): UseBookAccessState {
  const [data, setData] = useState<BookAccessPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const mountedRef = useRef(true);

  const fetchAccess = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/books/${bookId}/access`, {
        // Metadata is user-specific; the server marks it `private` and short-lived.
        cache: "default",
      });
      setStatus(res.status);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw Object.assign(
          new Error(body.error || "Unable to open ebook"),
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
        err instanceof Error ? err.message : "Unable to open ebook";
      setError(message);
      setData(null);
      return null;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [bookId]);

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
