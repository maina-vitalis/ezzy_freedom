import BlogForm from "@/components/forms/BlogForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create blog post – EZZ Freedom and Hope",
};

export default async function CreateBlogPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/not-found");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create blog post</h1>
        <p className="text-sm text-muted-foreground">
          Write a new post with a hero image and rich content.
        </p>
      </div>
      <BlogForm method="create" />
    </div>
  );
}
