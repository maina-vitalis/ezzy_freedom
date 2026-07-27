"use client";

import { Loader2 } from "lucide-react";

export default function LoadingScreen({ message = "Opening your ebook…" }: { message?: string }) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 bg-neutral-950 text-neutral-100">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm text-neutral-300">{message}</p>
    </div>
  );
}
