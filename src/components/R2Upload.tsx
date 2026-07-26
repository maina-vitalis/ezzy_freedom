"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export type R2UploadResult = {
  key: string;
  publicUrl?: string;
  name: string;
};

type R2UploadProps = {
  folder: string;
  accept: string;
  label?: string;
  publicAsset?: boolean;
  className?: string;
  onUploaded: (result: R2UploadResult) => void;
};

export default function R2Upload({
  folder,
  accept,
  label = "Choose file",
  publicAsset = false,
  className,
  onUploaded,
}: R2UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const presignRes = await fetch("/api/r2/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          folder,
          public: publicAsset,
        }),
      });

      const presign = await presignRes.json();
      if (!presignRes.ok) {
        throw new Error(presign.error || "Failed to get upload URL");
      }

      const putRes = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!putRes.ok) {
        throw new Error("Upload to Cloudflare R2 failed");
      }

      onUploaded({
        key: presign.key,
        publicUrl: presign.publicUrl,
        name: file.name,
      });
      toast.success("Upload complete");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
      console.error(err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-6",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={uploading}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-full"
      >
        {uploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {uploading ? "Uploading…" : label}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Stored on Cloudflare R2
      </p>
    </div>
  );
}
