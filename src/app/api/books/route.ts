/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookSchema, BookTypes } from "@/util/validation";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

//create book
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    // Parse and validate incoming book data with Zod schema
    const bookData: BookTypes = await req.json();
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
    } = BookSchema.parse(bookData);

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
export async function GET() {
  try {
    const data = await prisma.books.findMany();
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error: any) {
    console.log(error, "getting tours");
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
