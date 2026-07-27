import { auth } from "@/lib/auth";
import { assertCanAccessBook, BookAccessError } from "@/lib/books/access";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = Promise<{ bookId: string }>;

const progressSchema = z.object({
  currentPage: z.number().int().min(1),
});

/** PUT /api/books/[bookId]/progress */
export async function PUT(req: Request, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await props.params;
    await assertCanAccessBook(session.user.id, bookId);

    const body = progressSchema.parse(await req.json());

    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_bookId: { userId: session.user.id, bookId },
      },
      create: {
        userId: session.user.id,
        bookId,
        currentPage: body.currentPage,
      },
      update: {
        currentPage: body.currentPage,
      },
    });

    return NextResponse.json({
      currentPage: progress.currentPage,
      lastRead: progress.lastRead.toISOString(),
    });
  } catch (error) {
    if (error instanceof BookAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }
    console.error("Progress error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
