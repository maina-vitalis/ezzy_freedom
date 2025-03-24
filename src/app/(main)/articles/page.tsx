import ArticleComponent from "@/components/ArticleComponent";
import prisma from "@/lib/prisma";
import React from "react";

async function Articles() {
  const articles = await prisma.article.findMany({
    orderBy: { publishMonth: "desc" },
  });

  if (articles.length === 0) {
    return (
      <div className="mt-10 text-center text-sm">
        No articles, Come back later
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-3 text-center font-semibold md:text-xl">
        Articles : Monthly reads
      </h1>
      <div className="space-y-5">
        {articles.map((article) => (
          <ArticleComponent key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default Articles;
