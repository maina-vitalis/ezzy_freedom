/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionType } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteR2Object } from "@/lib/r2";
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

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, slug: true, r2Key: true },
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 },
      );
    }

    const deletedArticle = await prisma.article.delete({
      where: {
        id: articleId,
      },
    });

    // `UserPurchase.articleId` is SetNull, which leaves ARTICLE rows pointing at nothing.
    await prisma.userPurchase.deleteMany({
      where: { itemType: TransactionType.ARTICLE, articleId: null },
    });

    // Storage cleanup is best-effort; the article row is already gone.
    if (article.r2Key) {
      await deleteR2Object(article.r2Key);
    }

    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/article-details/${article.slug}`);
    revalidatePath("/dashboard/library");

    return NextResponse.json(
      {
        data: deletedArticle,
        message: "Article deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 },
      );
    }

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

    if (!session?.user || session.user.role !== "ADMIN") {
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
    const {
      title,
      coverImage,
      downloadUrl,
      publishDate,
      description,
      price,
      r2Key,
    } = ArticleSchema.parse(data);

    const parsedData = {
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
