import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSignedDownloadUrl } from "@/lib/r2";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/library/download?itemType=BOOK&itemId=xxx
 *
 * Security model:
 * 1. User must be authenticated.
 * 2. A completed UserPurchase record must exist linking the user to this item.
 * 3. The R2 key is retrieved server-side and a short-lived (1h) pre-signed URL
 *    is returned. The real R2 URL is never exposed to the client.
 */
export async function GET(req: NextRequest) {
  try {
    // ── 1. Authenticate ──────────────────────────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const itemType = searchParams.get("itemType"); // "BOOK" | "ARTICLE"
    const itemId = searchParams.get("itemId");

    if (!itemType || !itemId) {
      return NextResponse.json(
        { error: "itemType and itemId are required" },
        { status: 400 },
      );
    }

    if (itemType !== "BOOK" && itemType !== "ARTICLE") {
      return NextResponse.json({ error: "Invalid itemType" }, { status: 400 });
    }

    // ── 2. Verify ownership ──────────────────────────────────────────────────
    const purchase = await prisma.userPurchase.findFirst({
      where: {
        userId,
        ...(itemType === "BOOK" ? { bookId: itemId } : { articleId: itemId }),
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "You have not purchased this item" },
        { status: 403 },
      );
    }

    // ── 3. Get the R2 key ────────────────────────────────────────────────────
    let r2Key: string | null | undefined;

    if (itemType === "BOOK") {
      const book = await prisma.books.findUnique({
        where: { id: itemId },
        select: { r2Key: true, downLoadUrl: true },
      });
      r2Key = book?.r2Key;

      // Fallback: if no R2 key yet, return the legacy URL (uploadthing)
      if (!r2Key && book?.downLoadUrl) {
        return NextResponse.json({ url: book.downLoadUrl });
      }
    } else {
      const article = await prisma.article.findUnique({
        where: { id: itemId },
        select: { r2Key: true, downloadUrl: true },
      });
      r2Key = article?.r2Key;

      // Fallback: if no R2 key yet, return the legacy URL
      if (!r2Key && article?.downloadUrl) {
        return NextResponse.json({ url: article.downloadUrl });
      }
    }

    if (!r2Key) {
      return NextResponse.json(
        { error: "Download file not available" },
        { status: 404 },
      );
    }

    // ── 4. Generate pre-signed URL (1 hour) ──────────────────────────────────
    const signedUrl = await getSignedDownloadUrl(r2Key, 3600);

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error generating download URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
