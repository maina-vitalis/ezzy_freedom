"use client";

import { useCallback, useEffect, useState } from "react";

export type BookmarkItem = {
  id: string;
  pageNumber: number;
  label: string | null;
  createdAt: string;
};

export function useBookmarks(bookId: string) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/books/${bookId}/bookmarks`);
      if (!res.ok) return;
      const data = await res.json();
      setBookmarks(data.bookmarks ?? []);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addBookmark = useCallback(
    async (pageNumber: number, label?: string) => {
      const res = await fetch(`/api/books/${bookId}/bookmarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber, label }),
      });
      if (res.ok) await reload();
    },
    [bookId, reload],
  );

  const removeBookmark = useCallback(
    async (pageNumber: number) => {
      const res = await fetch(`/api/books/${bookId}/bookmarks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber }),
      });
      if (res.ok) await reload();
    },
    [bookId, reload],
  );

  const isBookmarked = useCallback(
    (pageNumber: number) => bookmarks.some((b) => b.pageNumber === pageNumber),
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    async (pageNumber: number) => {
      if (isBookmarked(pageNumber)) {
        await removeBookmark(pageNumber);
      } else {
        await addBookmark(pageNumber);
      }
    },
    [addBookmark, isBookmarked, removeBookmark],
  );

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    reload,
  };
}
