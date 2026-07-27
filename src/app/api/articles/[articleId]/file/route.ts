import { auth } from "@/lib/auth";
import {
  assertCanAccessArticle,
  BookAccessError,
} from "@/lib/books/access";
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

type Params = Promise<{ articleId: string }>;

/**
 * GET /api/articles/[articleId]/file
 * Range-capable R2 proxy with reader JWT fast-path for Vercel.
 */
export const runtime = "nodejs";
export async function GET(req: Request, props: { params: Params }) {
  try {
    const { articleId } = await props.params;

    const cookieStore = await cookies();
    const token = cookieStore.get(readerCookieName())?.value;
    const claims = token ? await verifyReaderToken(token) : null;

    let userId: string | null = null;
    let r2Key: string | null = null;

    if (
      claims &&
      claims.kind === "article" &&
      claims.cid === articleId
    ) {
      userId = claims.uid;
      r2Key = claims.r2Key;
    } else {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user) {
        return noStoreJson({ error: "Unauthorized" }, { status: 401 });
      }
      const { article } = await assertCanAccessArticle(
        session.user.id,
        articleId,
      );
      userId = session.user.id;
      r2Key = article.r2Key;
    }

    const limited = checkReaderRateLimit(`${userId}:${articleId}`);
    if (limited) return limited;

    return streamR2PdfResponse(r2Key, req.headers.get("range"));
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
