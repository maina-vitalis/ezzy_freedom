import { auth } from "@/lib/auth";
import {
  ensureUniqueBlogSlug,
  parseTagsInput,
} from "@/lib/blog";
import prisma from "@/lib/prisma";
import { BlogPostSchema } from "@/util/validation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (body.publishedAt) {
      body.publishedAt = new Date(body.publishedAt);
    } else if (body.publishedAt === "") {
      body.publishedAt = null;
    }
    const data = BlogPostSchema.parse(body);

    const slug = await ensureUniqueBlogSlug(data.title, data.slug || undefined);
    const tags = parseTagsInput(data.tags ?? "");
    const isPublished = data.status === "PUBLISHED";
    const publishedAt = isPublished
      ? data.publishedAt
        ? new Date(data.publishedAt)
        : new Date()
      : null;

    const post = await prisma.blogPost.create({
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
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/dashboard/blog");

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating blog post:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const isAdmin = session?.user?.role === "ADMIN";

    // Public callers only see published posts; admins can filter or see all.
    if (!isAdmin) {
      const posts = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      });
      return NextResponse.json(posts, { status: 200 });
    }

    const posts = await prisma.blogPost.findMany({
      where:
        status === "DRAFT" || status === "PUBLISHED"
          ? { status }
          : undefined,
      orderBy: [{ updatedAt: "desc" }],
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching blog posts:", error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ message }, { status: 500 });
  }
}
