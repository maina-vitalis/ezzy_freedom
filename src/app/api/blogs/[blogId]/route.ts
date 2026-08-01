import { auth } from "@/lib/auth";
import {
  ensureUniqueBlogSlug,
  parseTagsInput,
} from "@/lib/blog";
import prisma from "@/lib/prisma";
import { BlogPostSchema } from "@/util/validation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ blogId: string }>;

export async function GET(
  _req: NextRequest,
  props: { params: Params },
) {
  try {
    const { blogId } = await props.params;
    const post = await prisma.blogPost.findUnique({ where: { id: blogId } });

    if (!post) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const isAdmin = session?.user?.role === "ADMIN";

    if (post.status !== "PUBLISHED" && !isAdmin) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching blog post:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { blogId } = await props.params;
    const existing = await prisma.blogPost.findUnique({
      where: { id: blogId },
      select: { id: true, slug: true, status: true, publishedAt: true },
    });

    if (!existing) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    const body = await req.json();
    if (body.publishedAt) {
      body.publishedAt = new Date(body.publishedAt);
    } else if (body.publishedAt === "") {
      body.publishedAt = null;
    }
    const data = BlogPostSchema.parse(body);

    const slug = await ensureUniqueBlogSlug(
      data.title,
      data.slug || existing.slug,
      blogId,
    );
    const tags = parseTagsInput(data.tags ?? "");
    const isPublished = data.status === "PUBLISHED";
    const publishedAt = isPublished
      ? data.publishedAt
        ? new Date(data.publishedAt)
        : existing.publishedAt || new Date()
      : null;

    const post = await prisma.blogPost.update({
      where: { id: blogId },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        heroImage: data.heroImage,
        category: data.category,
        tags,
        authorName: data.authorName,
        status: data.status,
        publishedAt,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/dashboard/blog");

    return NextResponse.json(
      { data: post, message: "Updated successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error updating blog post:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Params },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { blogId } = await props.params;
    const post = await prisma.blogPost.findUnique({
      where: { id: blogId },
      select: { id: true, slug: true },
    });

    if (!post) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id: blogId } });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/dashboard/blog");

    return NextResponse.json(
      { message: "Blog post deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error deleting blog post:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
