"use client";

import { Button } from "@/components/ui/button";
import { BookX, Lock, LogIn, RefreshCw } from "lucide-react";
import Link from "next/link";

type ReaderErrorProps = {
  status?: number | null;
  message: string;
  onRetry?: () => void;
  bookSlug?: string;
};

export default function ReaderError({
  status,
  message,
  onRetry,
  bookSlug,
}: ReaderErrorProps) {
  const isAuth = status === 401;
  const isForbidden = status === 403;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-neutral-950 px-6 text-center text-neutral-100">
      <div className="rounded-full bg-primary/15 p-5">
        {isAuth ? (
          <LogIn className="h-10 w-10 text-primary" />
        ) : isForbidden ? (
          <Lock className="h-10 w-10 text-primary" />
        ) : (
          <BookX className="h-10 w-10 text-primary" />
        )}
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-2xl font-semibold">
          {isAuth
            ? "Sign in required"
            : isForbidden
              ? "Purchase required"
              : "Unable to open ebook"}
        </h1>
        <p className="text-sm text-neutral-400">{message}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {isAuth && (
          <Button asChild className="rounded-full">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        )}
        {isForbidden && bookSlug && (
          <Button asChild className="rounded-full">
            <Link href={`/book-details/${bookSlug}`}>View book details</Link>
          </Button>
        )}
        {onRetry && !isAuth && !isForbidden && (
          <Button onClick={onRetry} variant="outline" className="rounded-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        )}
        <Button asChild variant="ghost" className="rounded-full text-neutral-300">
          <Link href="/dashboard/library">Back to library</Link>
        </Button>
      </div>
    </div>
  );
}
