import EbookReader from "@/components/reader/EbookReader";
import ReaderError from "@/components/reader/ReaderError";
import { auth } from "@/lib/auth";
import { assertCanAccessArticle, BookAccessError } from "@/lib/books/access";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Article Reader",
  robots: { index: false, follow: false },
};

type Params = Promise<{ articleId: string }>;

export default async function ArticleReaderPage({
  params,
}: {
  params: Params;
}) {
  const { articleId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect(
      `/sign-in?callbackUrl=${encodeURIComponent(`/reader/article/${articleId}`)}`,
    );
  }

  try {
    const { article } = await assertCanAccessArticle(
      session.user.id,
      articleId,
    );
    return (
      <EbookReader
        contentId={article.id}
        contentType="article"
        initialTitle={article.title}
        contentSlug={article.slug}
      />
    );
  } catch (error) {
    if (error instanceof BookAccessError) {
      let slug: string | undefined;
      if (error.status === 403) {
        const article = await prisma.article.findUnique({
          where: { id: articleId },
          select: { slug: true },
        });
        slug = article?.slug;
      }
      return (
        <div className="min-h-dvh bg-neutral-950">
          <ReaderError
            status={error.status}
            message={error.message}
            contentSlug={slug}
            contentType="article"
          />
        </div>
      );
    }
    throw error;
  }
}
