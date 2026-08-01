import BlogContent from "@/components/blog/BlogContent";
import { Button } from "@/components/ui/button";
import { estimateReadTimeMinutes, stripHtml } from "@/lib/blog";
import { normalizeImageSrc } from "@/lib/image";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: Params }) {
  const { slug } = await props.params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
  });

  if (!post) {
    return { title: "Post not found | EZZ Freedom and Hope" };
  }

  const description =
    post.metaDescription ||
    post.excerpt ||
    stripHtml(post.content).slice(0, 160);

  return {
    title: `${post.metaTitle || post.title} | EZZ Freedom and Hope`,
    description,
    openGraph: {
      title: post.metaTitle || post.title,
      description,
      images: [post.heroImage],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage(props: { params: Params }) {
  const { slug } = await props.params;

  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
  });

  if (!post) notFound();

  const readTime = estimateReadTimeMinutes(post.content);
  const publishedLabel = post.publishedAt
    ? format(post.publishedAt, "MMMM d, yyyy")
    : null;

  return (
    <article className="pb-12">
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
        <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden bg-muted md:h-[52vh]">
          <Image
            src={normalizeImageSrc(post.heroImage)}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-20 max-w-3xl md:-mt-28">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All posts
          </Link>
        </Button>

        <header className="mb-10 space-y-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-wide text-primary">
            <span>{post.category}</span>
            {publishedLabel ? (
              <>
                <span className="text-border">·</span>
                <time dateTime={post.publishedAt?.toISOString()}>
                  {publishedLabel}
                </time>
              </>
            ) : null}
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            {post.title}
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 border-y border-border py-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{post.authorName}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readTime} min read
            </span>
          </div>

          {post.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <BlogContent html={post.content} />
      </div>
    </article>
  );
}
