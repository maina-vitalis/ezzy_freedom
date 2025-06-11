/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ArticleSchema } from "@/util/validation"; // Updated schema import
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

type Params = Promise<{
  articleId: string;
}>;

// Delete an article
export async function DELETE(req: NextRequest, props: { params: Params }) {
  const { articleId } = await props.params;
  try {
    // Check the role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session || session.user.role === "user") {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // Delete the article
    const deletedArticle = await prisma.article.delete({
      where: {
        id: articleId,
      },
    });

    return NextResponse.json(
      {
        data: deletedArticle,
        message: "Article deleted successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      {
        message: error.message || "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

// Update an article
export async function PUT(req: Request, props: { params: Params }) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session || session.user.role === "user") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract and validate articleId
    const { articleId } = await props.params;
    if (!articleId) {
      return NextResponse.json(
        { message: "Missing articleId" },
        { status: 400 },
      );
    }

    // Extract request body
    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    // Parse and validate with ArticleSchema
    const { title, coverImage, downloadUrl, publishDate, description, price } =
      ArticleSchema.parse(data);

    const parsedData = {
      title,
      coverImage,
      downloadUrl,
      publishDate,
      description,
      price,
      slug: slugify(title, {
        lower: true,
        trim: true,
      }),
    };

    // Update article
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: parsedData,
    });

    revalidatePath("/"); // Revalidate the root path (adjust as needed)

    return NextResponse.json(
      { data: updatedArticle, message: "Updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
