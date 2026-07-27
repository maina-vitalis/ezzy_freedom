import { auth } from "@/lib/auth";
import {
  assertCanAccessArticle,
  BookAccessError,
} from "@/lib/books/access";
import {
  readerCookieName,
  readerTokenCookieOptions,
  signReaderToken,
} from "@/lib/books/reader-token";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type Params = Promise<{ articleId: string }>;

/**
 * GET /api/articles/[articleId]/access
 * Entitlement + reader metadata + short-lived reader JWT cookie.
 */
export async function GET(_req: Request, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { articleId } = await props.params;
    const { article, purchaseId } = await assertCanAccessArticle(
      session.user.id,
      articleId,
    );

    const token = await signReaderToken({
      uid: session.user.id,
      cid: article.id,
      kind: "article",
      r2Key: article.r2Key,
    });

    const res = NextResponse.json({
      book: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        coverImage: article.coverImage,
      },
      watermark: {
        name: session.user.name,
        email: session.user.email,
        orderId: purchaseId ?? "FREE",
        date: new Date().toISOString().slice(0, 10),
      },
      progress: {
        currentPage: 1,
        lastRead: null,
      },
    });

    res.cookies.set(readerCookieName(), token, readerTokenCookieOptions());
    res.headers.set("Cache-Control", "private, max-age=60, must-revalidate");
    res.headers.set("Vary", "Cookie");
    return res;
  } catch (error) {
    if (error instanceof BookAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Article access error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
