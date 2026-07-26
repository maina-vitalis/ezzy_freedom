import ArticleComponent from "@/components/ArticleComponent";
import prisma from "@/lib/prisma";
import { BookOpen, Calendar } from "lucide-react";

async function Articles() {
  const articles = await prisma.article.findMany({
    orderBy: { publishDate: "desc" },
  });

  if (articles.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6">
        <div className="space-y-4 text-center">
          <BookOpen className="mx-auto text-muted-foreground" size={64} />
          <h1 className="text-2xl font-bold md:text-3xl">
            No Articles Available
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            We&apos;re working on creating inspiring content for you. Check back
            soon for mental health insights and guidance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      {/* Header Section */}
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="mb-2 flex items-center justify-center gap-2">
            <BookOpen className="text-primary" size={28} />
            <span className="text-sm font-medium uppercase tracking-wide text-primary">
              Mental Health Resources
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Articles & Insights
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Explore our collection of thoughtfully crafted articles designed to
            provide guidance, hope, and practical wisdom for your mental health
            journey.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{articles.length} Articles</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>Monthly Updates</span>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Latest Articles
        </h2>
        <div className="grid gap-6">
          {articles.map((article: (typeof articles)[number]) => (
            <ArticleComponent key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Articles;
