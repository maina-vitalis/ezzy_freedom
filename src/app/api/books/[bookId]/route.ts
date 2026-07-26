/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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

    //delete the book
    const deletedBook = await prisma.books.delete({
      where: {
        id: bookId,
      },
    });

    return NextResponse.json(
      {
        data: deletedBook,
        message: "Book deleted successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
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
