import { estimateReadTimeMinutes } from "@/lib/blog";
import { normalizeImageSrc } from "@/lib/image";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    heroImage: string;
    category: string;
    authorName: string;
    publishedAt: Date | null;
    content: string;
  };
};

export default function BlogCard({ post }: BlogCardProps) {
  const readTime = estimateReadTimeMinutes(post.content);
  const dateLabel = post.publishedAt
    ? format(post.publishedAt, "MMM d, yyyy")
    : null;

  return (
    <article className="group grid gap-5 border-b border-border py-8 last:border-b-0 md:grid-cols-[240px_1fr] md:gap-8">
      <Link
        href={`/blog/${post.slug}`}
        className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted md:aspect-[5/4]"
      >
        <Image
          src={normalizeImageSrc(post.heroImage)}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 240px"
        />
      </Link>

      <div className="flex flex-col justify-center space-y-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-wide text-primary">
          <span>{post.category}</span>
          {dateLabel ? (
            <>
              <span className="text-border">·</span>
              <time dateTime={post.publishedAt?.toISOString()}>{dateLabel}</time>
            </>
          ) : null}
        </div>

        <h2 className="text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-2xl">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className="line-clamp-2 text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-sm text-muted-foreground">
          <span>{post.authorName}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readTime} min read
          </span>
        </div>
      </div>
    </article>
  );
}
