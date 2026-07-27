import { auth } from "@/lib/auth";
import { assertCanAccessBook, BookAccessError } from "@/lib/books/access";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = Promise<{ bookId: string }>;

const createSchema = z.object({
  pageNumber: z.number().int().min(1),
  label: z.string().max(120).optional(),
});

const deleteSchema = z.object({
  pageNumber: z.number().int().min(1),
});

/** GET /api/books/[bookId]/bookmarks */
export async function GET(_req: Request, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await props.params;
    await assertCanAccessBook(session.user.id, bookId);

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id, bookId },
      orderBy: { pageNumber: "asc" },
      select: {
        id: true,
        pageNumber: true,
        label: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    if (error instanceof BookAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Bookmarks GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/** POST /api/books/[bookId]/bookmarks */
export async function POST(req: Request, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await props.params;
    await assertCanAccessBook(session.user.id, bookId);

    const body = createSchema.parse(await req.json());

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_bookId_pageNumber: {
          userId: session.user.id,
          bookId,
          pageNumber: body.pageNumber,
        },
      },
      create: {
        userId: session.user.id,
        bookId,
        pageNumber: body.pageNumber,
        label: body.label,
      },
      update: {
        label: body.label,
      },
    });

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (error) {
    if (error instanceof BookAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid bookmark data" }, { status: 400 });
    }
    console.error("Bookmarks POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/** DELETE /api/books/[bookId]/bookmarks */
export async function DELETE(req: Request, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await props.params;
    await assertCanAccessBook(session.user.id, bookId);

    const body = deleteSchema.parse(await req.json());

    await prisma.bookmark.deleteMany({
      where: {
        userId: session.user.id,
        bookId,
        pageNumber: body.pageNumber,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof BookAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }
    console.error("Bookmarks DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
