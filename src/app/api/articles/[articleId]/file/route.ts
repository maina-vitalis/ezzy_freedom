import { auth } from "@/lib/auth";
import {
  assertCanAccessArticle,
  BookAccessError,
} from "@/lib/books/access";
import { getR2Object } from "@/lib/r2";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Readable } from "node:stream";

type Params = Promise<{ articleId: string }>;

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 120;

type RateBucket = { count: number; windowStart: number };

type GlobalWithReaderFileBuckets = {
  __readerArticleFileRateBuckets?: Map<string, RateBucket>;
};

const globalWithBuckets = globalThis as unknown as GlobalWithReaderFileBuckets;

const rateBuckets: Map<string, RateBucket> =
  globalWithBuckets.__readerArticleFileRateBuckets ??
  new Map<string, RateBucket>();
globalWithBuckets.__readerArticleFileRateBuckets = rateBuckets;

function noStoreJson(body: unknown, init?: ResponseInit) {
  const res = NextResponse.json(body, init);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Vary", "Cookie, Range");
  return res;
}

/**
 * GET /api/articles/[articleId]/file
 *
 * Streams the article PDF from R2 through Next.js with entitlement + Range support.
 */
export const runtime = "nodejs";
export async function GET(req: Request, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return noStoreJson({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId } = await props.params;
    const { article } = await assertCanAccessArticle(
      session.user.id,
      articleId,
    );

    const key = `${session.user.id}:${articleId}`;
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

    const rangeHeader = req.headers.get("range");
    const r2Object = await getR2Object(article.r2Key, rangeHeader);

    const body = r2Object.Body;
    if (!body) {
      return noStoreJson({ error: "Article not found" }, { status: 404 });
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
    console.error("Article file proxy error:", error);
    return noStoreJson(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
