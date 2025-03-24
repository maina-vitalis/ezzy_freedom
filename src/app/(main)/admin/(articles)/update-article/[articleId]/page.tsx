import ArticleForm from "@/components/forms/ArticleForm";
import prisma from "@/lib/prisma";

type UpdateBookProps = Promise<{
  articleId: string;
}>;

async function UpdateBook(props: { params: UpdateBookProps }) {
  const { articleId } = await props.params;

  //fetch book
  const article = await prisma.article.findUnique({
    where: {
      id: articleId,
    },
  });

  if (!article) {
    return (
      <div className="mt-5 text-center text-sm font-semibold">
        No article found
      </div>
    );
  }

  return (
    <div>
      <ArticleForm article={article} method="update" />
    </div>
  );
}

export default UpdateBook;
