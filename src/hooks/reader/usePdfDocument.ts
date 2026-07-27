"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

type UsePdfDocumentOptions = {
  fileUrl: string | null;
  onFileAuthExpired?: () => Promise<unknown>;
};

type UsePdfDocumentResult = {
  pdf: PDFDocumentProxy | null;
  numPages: number;
  loading: boolean;
  error: string | null;
};

let workerConfigured = false;

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!workerConfigured) {
    // CDN path avoids Next/Turbopack bundling issues with the worker module
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    workerConfigured = true;
  }
  return pdfjs;
}

export function usePdfDocument({
  fileUrl,
  onFileAuthExpired,
}: UsePdfDocumentOptions): UsePdfDocumentResult {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);

  const load = useCallback(
    async (url: string, allowRetry = true) => {
      setLoading(true);
      setError(null);
      try {
        if (pdfRef.current) {
          await pdfRef.current.cleanup();
          pdfRef.current = null;
        }

        const pdfjs = await getPdfjs();
        const task = pdfjs.getDocument({
          url,
          // Same-origin proxy requires cookies for entitlement checks.
          withCredentials: true,
        });
        const doc = await task.promise;
        pdfRef.current = doc;
        setPdf(doc);
        setNumPages(doc.numPages);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load PDF";

        const isAuthError = /403|401|unauthorized|expired/i.test(message);
        const isRangeError =
          /416|range|invalid range|RangeError|unexpected number of bytes/i.test(message);

        // Session may have expired mid-load (file route enforces entitlement per request).
        if (allowRetry && isAuthError && onFileAuthExpired) {
          await onFileAuthExpired();
          // `/file` URL is stable; refresh only updates entitlement/session state.
          // Retry the exact same load once to avoid getting stuck.
          if (allowRetry) {
            await load(url, false);
          }
          return;
        }

        if (isRangeError) {
          setError(
            `Range requests through the reader proxy appear to be failing. ` +
              `Please approve the pre-split-per-page R2 strategy if you want to proceed. ` +
              `(Details: ${message})`,
          );
          setPdf(null);
          setNumPages(0);
          return;
        }

        setError(message);
        setPdf(null);
        setNumPages(0);
      } finally {
        setLoading(false);
      }
    },
    [onFileAuthExpired],
  );

  useEffect(() => {
    if (!fileUrl) return;
    // Keep the in-memory PDF across file-auth refreshes; only load once
    // (or again after destroy / failed load).
    if (pdfRef.current) return;
    void load(fileUrl);
  }, [fileUrl, load]);

  useEffect(() => {
    return () => {
      void pdfRef.current?.cleanup();
      pdfRef.current = null;
    };
  }, []);

  return { pdf, numPages, loading, error };
}
