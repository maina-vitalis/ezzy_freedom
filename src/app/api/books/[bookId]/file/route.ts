import { auth } from "@/lib/auth";
import { assertCanAccessBook, BookAccessError } from "@/lib/books/access";
import {
  readerCookieName,
  verifyReaderToken,
} from "@/lib/books/reader-token";
import {
  checkReaderRateLimit,
  noStoreJson,
  streamR2PdfResponse,
} from "@/lib/books/stream-file";
import { cookies, headers } from "next/headers";

type Params = Promise<{ bookId: string }>;

/**
 * GET /api/books/[bookId]/file
 *
 * Range-capable R2 proxy. Prefers short-lived reader JWT (no DB) so PDF.js
 * range bursts stay fast on Vercel serverless.
 */
export const runtime = "nodejs";
export async function GET(req: Request, props: { params: Params }) {
  try {
    const { bookId } = await props.params;

    const cookieStore = await cookies();
    const token = cookieStore.get(readerCookieName())?.value;
    const claims = token ? await verifyReaderToken(token) : null;

    let userId: string | null = null;
    let r2Key: string | null = null;

    if (
      claims &&
      claims.kind === "book" &&
      claims.cid === bookId
    ) {
      userId = claims.uid;
      r2Key = claims.r2Key;
    } else {
      // Fallback: full session + entitlement check (cold open / expired token).
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user) {
        return noStoreJson({ error: "Unauthorized" }, { status: 401 });
      }
      const { book } = await assertCanAccessBook(session.user.id, bookId);
      userId = session.user.id;
      r2Key = book.r2Key;
    }

    const limited = checkReaderRateLimit(`${userId}:${bookId}`);
    if (limited) return limited;

    return streamR2PdfResponse(r2Key, req.headers.get("range"));
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
