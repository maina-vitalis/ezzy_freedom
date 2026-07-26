/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ArticleSchema, ArticleType } from "@/util/validation"; // Updated schema import
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import slugify from "slugify";

// Create article
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate incoming article data with Zod schema
    const articleData: ArticleType = await req.json();
    const {
      title,
      coverImage,
      downloadUrl,
      publishDate,
      description,
      price,
      r2Key,
    } = ArticleSchema.parse(articleData);

    const parsedArticleData = {
      title,
      coverImage,
      downloadUrl: downloadUrl || `r2://${r2Key}`,
      publishDate,
      description,
      price,
      r2Key,
      slug: slugify(title, {
        lower: true,
        trim: true,
      }),
    };

    // Create the article in the database
    const createdArticleData = await prisma.article.create({
      data: parsedArticleData,
    });

    return NextResponse.json({ data: createdArticleData }, { status: 200 });
  } catch (error: any) {
    console.error("Error in creating article:", error);
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

// Get all articles ordered by most recent
export async function GET() {
  try {
    const data = await prisma.article.findMany({
      orderBy: {
        publishDate: "desc", // Most recent articles first
      },
    });
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error fetching articles:", error);
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
