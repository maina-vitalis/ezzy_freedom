import BlogManagementTable, {
  type BlogTableRow,
} from "@/components/blog/BlogManagementTable";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Blog posts – EZZ Freedom and Hope",
};

export default async function BlogAdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/not-found");
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const rows: BlogTableRow[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    status: post.status,
    heroImage: post.heroImage,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    updatedAt: post.updatedAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog posts</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage editorial content for the public blog.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dashboard/blog/create">
            <Plus className="mr-2 h-4 w-4" />
            New post
          </Link>
        </Button>
      </div>

      <BlogManagementTable data={rows} />
    </div>
  );
}
