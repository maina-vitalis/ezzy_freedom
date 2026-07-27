"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadButtonProps {
  itemId: string;
  itemType: "ARTICLE";
}

/**
 * Fetches a short-lived signed R2 download URL for articles only.
 * Books are reader-only and must not use this component.
 */
export default function DownloadButton({ itemId, itemType }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/library/download?itemType=${itemType}&itemId=${itemId}`,
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to generate download link");
      }

      const { url } = await res.json();
      // Open the signed URL in a new tab to trigger the browser download
      window.open(url, "_blank", "noopener,noreferrer");
      toast.success("Download started! The link expires in 1 hour.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Download failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      onClick={handleDownload}
      disabled={loading}
      id={`download-${itemType.toLowerCase()}-${itemId}`}
    >
      {loading ? (
        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
      ) : (
        <Download className="mr-2 h-3 w-3" />
      )}
      {loading ? "Preparing..." : "Download"}
    </Button>
  );
}
