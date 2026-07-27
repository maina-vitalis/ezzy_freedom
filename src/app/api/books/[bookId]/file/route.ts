import { auth } from "@/lib/auth";
import { assertCanAccessBook, BookAccessError } from "@/lib/books/access";
import { getR2Object } from "@/lib/r2";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Readable } from "node:stream";

type Params = Promise<{ bookId: string }>;

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 120;

type RateBucket = { count: number; windowStart: number };

type GlobalWithReaderFileBuckets = {
  __readerFileRateBuckets?: Map<string, RateBucket>;
};

const globalWithBuckets = globalThis as unknown as GlobalWithReaderFileBuckets;

// Keep rate limit buckets stable across hot reloads (best-effort).
const rateBuckets: Map<string, RateBucket> =
  globalWithBuckets.__readerFileRateBuckets ?? new Map<string, RateBucket>();
globalWithBuckets.__readerFileRateBuckets = rateBuckets;

function noStoreJson(body: unknown, init?: ResponseInit) {
  const res = NextResponse.json(body, init);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie, Range");
  return res;
}

/**
 * GET /api/books/[bookId]/file
 *
 * Streams the underlying R2 object through Next.js, checking entitlement on every request.
 * Supports HTTP Range so PDF.js can fetch only required byte ranges.
 */
export const runtime = "nodejs";
export async function GET(req: Request, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return noStoreJson({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await props.params;
    const { book } = await assertCanAccessBook(session.user.id, bookId);

    // Basic per-user/per-book rate limit for range requests.
    const key = `${session.user.id}:${bookId}`;
    const now = Date.now();
    let bucket = rateBuckets.get(key);
    if (!bucket || now - bucket.windowStart > RATE_WINDOW_MS) {
      bucket = { count: 0, windowStart: now };
    }
    if (bucket.count >= RATE_MAX_REQUESTS) {
      const retryAfterSeconds = Math.ceil(
        (RATE_WINDOW_MS - (now - bucket.windowStart)) / 1000,
      );
      const res = noStoreJson(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
      );
      return res;
    }
    bucket.count += 1;
    rateBuckets.set(key, bucket);

    const rangeHeader = req.headers.get("range");
    const r2Object = await getR2Object(book.r2Key, rangeHeader);

    const body = r2Object.Body;
    if (!body) {
      return noStoreJson({ error: "Ebook not found" }, { status: 404 });
    }

    const status = r2Object.$metadata.httpStatusCode ?? (rangeHeader ? 206 : 200);

    // AWS SDK returns a Node Readable stream; convert to a web stream for Next.
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

    const contentType = r2Object.ContentType;
    if (contentType) resHeaders.set("Content-Type", contentType);
    resHeaders.set("Accept-Ranges", "bytes");
    resHeaders.set("Content-Disposition", "inline");

    const contentLength = r2Object.ContentLength;
    if (typeof contentLength === "number") {
      resHeaders.set("Content-Length", String(contentLength));
    }

    const contentRange = r2Object.ContentRange;
    if (contentRange) resHeaders.set("Content-Range", contentRange);

    if (r2Object.ETag) resHeaders.set("ETag", r2Object.ETag);

    return new NextResponse(responseBody, {
      status,
      headers: resHeaders,
    });
  } catch (error) {
    if (error instanceof BookAccessError) {
      return noStoreJson({ error: error.message }, { status: error.status });
    }
    console.error("Book file proxy error:", error);
    return noStoreJson(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

