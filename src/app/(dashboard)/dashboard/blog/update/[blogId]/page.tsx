import BlogForm from "@/components/forms/BlogForm";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

type Params = Promise<{ blogId: string }>;

export const metadata = {
  title: "Edit blog post – EZZ Freedom and Hope",
};

export default async function UpdateBlogPage(props: { params: Params }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/not-found");
  }

  const { blogId } = await props.params;
  const post = await prisma.blogPost.findUnique({ where: { id: blogId } });

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit blog post</h1>
        <p className="text-sm text-muted-foreground">{post.title}</p>
      </div>
      <BlogForm method="update" post={post} />
    </div>
  );
}
