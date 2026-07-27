import { getR2Object } from "@/lib/r2";
import { NextResponse } from "next/server";
import { Readable } from "node:stream";

type RateBucket = { count: number; windowStart: number };

type GlobalWithBuckets = {
  __readerFileRateBuckets?: Map<string, RateBucket>;
};

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 180;

const globalWithBuckets = globalThis as unknown as GlobalWithBuckets;
const rateBuckets: Map<string, RateBucket> =
  globalWithBuckets.__readerFileRateBuckets ?? new Map<string, RateBucket>();
globalWithBuckets.__readerFileRateBuckets = rateBuckets;

export function noStoreJson(body: unknown, init?: ResponseInit) {
  const res = NextResponse.json(body, init);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie, Range");
  return res;
}

export function checkReaderRateLimit(key: string): NextResponse | null {
  const now = Date.now();
  let bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.windowStart > RATE_WINDOW_MS) {
    bucket = { count: 0, windowStart: now };
  }
  if (bucket.count >= RATE_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil(
      (RATE_WINDOW_MS - (now - bucket.windowStart)) / 1000,
    );
    return noStoreJson(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  return null;
}

/**
 * Stream an R2 PDF object (full or Range) with no-store headers.
 * Used by book + article file proxies on Vercel Node runtime.
 */
export async function streamR2PdfResponse(
  r2Key: string,
  rangeHeader: string | null,
): Promise<NextResponse> {
  const r2Object = await getR2Object(r2Key, rangeHeader);
  const body = r2Object.Body;
  if (!body) {
    return noStoreJson({ error: "File not found" }, { status: 404 });
  }

  const status =
    r2Object.$metadata.httpStatusCode ?? (rangeHeader ? 206 : 200);

  const responseBody = (() => {
    const hasPipe =
      typeof (body as unknown as { pipe?: unknown }).pipe === "function";
    if (hasPipe) {
      const nodeStream = body as unknown as Readable;
      return Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
    }
    return body as unknown as ReadableStream<Uint8Array>;
  })();

  const resHeaders = new Headers();
  resHeaders.set("Cache-Control", "no-store");
  resHeaders.set("Pragma", "no-cache");
  resHeaders.set("Vary", "Cookie, Range");

  const contentType = r2Object.ContentType || "application/pdf";
  resHeaders.set("Content-Type", contentType);
  resHeaders.set("Accept-Ranges", "bytes");
  resHeaders.set("Content-Disposition", "inline");

  if (typeof r2Object.ContentLength === "number") {
    resHeaders.set("Content-Length", String(r2Object.ContentLength));
  }
  if (r2Object.ContentRange) {
    resHeaders.set("Content-Range", r2Object.ContentRange);
  }
  if (r2Object.ETag) resHeaders.set("ETag", r2Object.ETag);

  return new NextResponse(responseBody, {
    status,
    headers: resHeaders,
  });
}
