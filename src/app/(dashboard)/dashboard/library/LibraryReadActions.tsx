"use client";

import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface LibraryReadActionsProps {
  href: string;
  hasR2Key: boolean;
  label?: string;
}

/** Primary library CTA — opens the secure in-app PDF reader. */
export default function LibraryReadActions({
  href,
  hasR2Key,
  label = "Read",
}: LibraryReadActionsProps) {
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
      <Link href={href}>
        <BookOpen className="mr-2 h-3 w-3" />
        {label}
      </Link>
    </Button>
  );
}
