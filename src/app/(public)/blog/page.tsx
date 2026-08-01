import BlogCard from "@/components/blog/BlogCard";
import prisma from "@/lib/prisma";
import { PenLine } from "lucide-react";

export const metadata = {
  title: "Blog | EZZ Freedom and Hope",
  description:
    "Stories, guidance, and insights on mental health, recovery, and hope from EZZ Freedom and Hope.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  if (posts.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <PenLine className="mb-4 text-muted-foreground" size={56} />
        <h1 className="text-2xl font-bold md:text-3xl">Blog coming soon</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          We&apos;re preparing thoughtful posts on wellness, recovery, and hope.
          Check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <header className="mb-10 space-y-3 border-b border-border pb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Insights & stories
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Blog
        </h1>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Practical wisdom and encouragement for your mental health journey.
        </p>
      </header>

      <div>
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
