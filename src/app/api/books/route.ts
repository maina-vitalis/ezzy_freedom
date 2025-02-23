/* eslint-disable @typescript-eslint/no-explicit-any */
import { addBookSchema, AddBookTypes } from "@/util/validation";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.session) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    // Parse and validate incoming book data with Zod schema
    const bookData: AddBookTypes = await req.json();
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
    } = addBookSchema.parse(bookData);

    const parsedBookData = {
      additionalInfo,
      bookOverview,
      coverImage,
      downLoadUrl: downloadUrl,
      highlights,
      price,
      targetAudience,
      title,
      slug: slugify(title, {
        lower: true,
        trim: true,
      }),
      fileKey,
    };

    // Create the book in the database
    const createdBookData = await prisma.books.create({
      data: parsedBookData,
    });

    return NextResponse.json({ data: createdBookData }, { status: 200 });
  } catch (error: any) {
    console.error("Error in creating book:", error);
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}

//get the books
