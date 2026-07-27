"use client";

import { Button } from "@/components/ui/button";
import type { BookmarkItem } from "@/hooks/reader/useBookmarks";
import { Bookmark, Trash2, X } from "lucide-react";

type BookmarkPanelProps = {
  bookmarks: BookmarkItem[];
  loading?: boolean;
  onJump: (page: number) => void;
  onRemove: (page: number) => void;
  onClose: () => void;
};

export default function BookmarkPanel({
  bookmarks,
  loading,
  onJump,
  onRemove,
  onClose,
}: BookmarkPanelProps) {
  return (
    <aside className="flex h-full w-72 flex-col border-l border-white/10 bg-neutral-950/95 text-neutral-100">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Bookmark className="h-4 w-4 text-primary" />
          Bookmarks
        </h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {loading && (
          <p className="p-3 text-xs text-neutral-400">Loading…</p>
        )}
        {!loading && bookmarks.length === 0 && (
          <p className="p-3 text-xs text-neutral-400">
            No bookmarks yet. Tap the bookmark icon to save this page.
          </p>
        )}
        <ul className="space-y-1">
          {bookmarks.map((b) => (
            <li
              key={b.id}
              className="flex items-center gap-1 rounded-md hover:bg-white/5"
            >
              <button
                type="button"
                className="flex-1 truncate px-3 py-2 text-left text-sm"
                onClick={() => onJump(b.pageNumber)}
              >
                {b.label || `Page ${b.pageNumber}`}
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-neutral-400 hover:text-red-400"
                onClick={() => onRemove(b.pageNumber)}
                aria-label={`Remove bookmark on page ${b.pageNumber}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
