"use client";

import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface LibraryBookActionsProps {
  bookId: string;
  hasR2Key: boolean;
}

/** Primary library CTA — opens the secure in-app flipbook reader. */
export default function LibraryBookActions({
  bookId,
  hasR2Key,
}: LibraryBookActionsProps) {
  if (!hasR2Key) {
    return (
      <Button disabled size="sm" className="w-full rounded-full">
        <BookOpen className="mr-2 h-3 w-3" />
        Unavailable
      </Button>
    );
  }

  return (
    <Button asChild size="sm" className="w-full rounded-full">
      <Link href={`/reader/${bookId}`}>
        <BookOpen className="mr-2 h-3 w-3" />
        Read
      </Link>
    </Button>
  );
}
