import ArticleForm from "@/components/forms/ArticleForm";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type UpdateArticleProps = Promise<{
  articleId: string;
}>;

export const metadata = {
  title: "Update Article – EZZ Freedom and Hope",
};

async function UpdateArticlePage(props: { params: UpdateArticleProps }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/not-found");
  }

  const { articleId } = await props.params;

  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    return (
      <div className="mt-5 text-center text-sm font-semibold text-destructive">
        Article not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Update Article</h1>
      <ArticleForm article={article} method="update" />
    </div>
  );
}

export default UpdateArticlePage;
