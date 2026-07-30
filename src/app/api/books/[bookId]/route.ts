/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionType } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteR2Object } from "@/lib/r2";
import { BookSchema } from "@/util/validation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

type Params = Promise<{
  bookId: string;
}>;

//delete a book
export async function DELETE(req: NextRequest, props: { params: Params }) {
  const { bookId } = await props.params;
  try {
    //check the role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          message: "unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const book = await prisma.books.findUnique({
      where: { id: bookId },
      select: { id: true, slug: true, r2Key: true },
    });

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const deletedBook = await prisma.books.delete({
      where: {
        id: bookId,
      },
    });

    // `UserPurchase.bookId` is SetNull, which leaves BOOK rows pointing at nothing.
    await prisma.userPurchase.deleteMany({
      where: { itemType: TransactionType.BOOK, bookId: null },
    });

    // Storage cleanup is best-effort; the book row is already gone.
    if (book.r2Key) {
      await deleteR2Object(book.r2Key);
    }

    revalidatePath("/");
    revalidatePath("/books");
    revalidatePath(`/book-details/${book.slug}`);
    revalidatePath("/dashboard/library");

    return NextResponse.json(
      {
        data: deletedBook,
        message: "Book deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    console.error("Book delete error:", error);
    return NextResponse.json(
      {
        message: error.message || "internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

//update a book
export async function PUT(req: Request, props: { params: Params }) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract and validate bookId
    const { bookId } = (await props?.params) || {};
    if (!bookId) {
      return NextResponse.json({ message: "Missing bookId" }, { status: 400 });
    }

    // Extract request body
    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const {
      additionalInfo,
      bookOverview,
      coverImage,
      downloadUrl,
      highlights,
      price,
      targetAudience,
      title,
      fileKey,
      r2Key,
    } = BookSchema.parse(data);

    const parsedData = {
      additionalInfo,
      bookOverview,
      coverImage,
      downLoadUrl: downloadUrl || `r2://${r2Key}`,
      highlights,
      price,
      targetAudience,
      title,
      slug: slugify(title, {
        lower: true,
        trim: true,
      }),
      fileKey: fileKey || r2Key,
      r2Key,
    };

    // Update book
    const updatedBook = await prisma.books.update({
      where: { id: bookId },
      data: parsedData,
    });

    revalidatePath("/");

    return NextResponse.json(
      { data: updatedBook, message: "Updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
