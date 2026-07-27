import { auth } from "@/lib/auth";
import { assertCanAccessBook, BookAccessError } from "@/lib/books/access";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type Params = Promise<{ bookId: string }>;

/**
 * GET /api/books/[bookId]/access
 * Entitlement + reader metadata after verifying session + purchase.
 */
export async function GET(_req: Request, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await props.params;
    const { book, purchaseId } = await assertCanAccessBook(
      session.user.id,
      bookId,
    );

    const progress = await prisma.readingProgress.findUnique({
      where: {
        userId_bookId: { userId: session.user.id, bookId },
      },
      select: { currentPage: true, lastRead: true },
    });

    const res = NextResponse.json({
      book: {
        id: book.id,
        title: book.title,
        slug: book.slug,
        coverImage: book.coverImage,
      },
      watermark: {
        name: session.user.name,
        email: session.user.email,
        orderId: purchaseId ?? "FREE",
        date: new Date().toISOString().slice(0, 10),
      },
      progress: {
        currentPage: progress?.currentPage ?? 1,
        lastRead: progress?.lastRead?.toISOString() ?? null,
      },
    });

    // User-specific metadata; keep it short-lived and private.
    res.headers.set("Cache-Control", "private, max-age=60, must-revalidate");
    res.headers.set("Vary", "Cookie");
    return res;
  } catch (error) {
    if (error instanceof BookAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Book access error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
