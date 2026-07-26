import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSignedDownloadUrl } from "@/lib/r2";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/library/download?itemType=BOOK&itemId=xxx
 *
 * Books and articles require R2 keys — no UploadThing fallback.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const itemType = searchParams.get("itemType");
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

    if (itemType === "BOOK") {
      const book = await prisma.books.findUnique({
        where: { id: itemId },
        select: { r2Key: true, price: true },
      });

      if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }

      if (book.price !== 0) {
        const purchase = await prisma.userPurchase.findFirst({
          where: { userId, bookId: itemId },
        });
        if (!purchase) {
          return NextResponse.json(
            { error: "You have not purchased this item" },
            { status: 403 },
          );
        }
      }

      if (!book.r2Key) {
        return NextResponse.json(
          {
            error:
              "Download file not available. The admin needs to re-upload this book to Cloudflare R2.",
          },
          { status: 404 },
        );
      }

      const signedUrl = await getSignedDownloadUrl(book.r2Key, 3600);
      return NextResponse.json({ url: signedUrl });
    }

    const purchase = await prisma.userPurchase.findFirst({
      where: { userId, articleId: itemId },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "You have not purchased this item" },
        { status: 403 },
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: itemId },
      select: { r2Key: true },
    });

    if (!article?.r2Key) {
      return NextResponse.json(
        {
          error:
            "Download file not available. The admin needs to re-upload this article to Cloudflare R2.",
        },
        { status: 404 },
      );
    }

    const signedUrl = await getSignedDownloadUrl(article.r2Key, 3600);
    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error generating download URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
