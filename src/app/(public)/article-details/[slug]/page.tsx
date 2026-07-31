import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TransactionType } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  Lock,
  MessageCircle,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { normalizeImageSrc } from "@/lib/image";

type ArticlePageProps = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: ArticlePageProps }) {
  const { slug } = await props.params;
  const article = await prisma.article.findFirst({
    where: {
      slug,
    },
  });
  if (!article) redirect(notFound());

  return {
    title: `${article.title} - Mental Health Article | EZZ Freedom and Hope`,
    description: article.description.replace(/<[^>]*>/g, "").substring(0, 160),
    openGraph: {
      title: article.title,
      description: article.description
        .replace(/<[^>]*>/g, "")
        .substring(0, 160),
      images: [article.coverImage],
    },
    keywords: [
      "mental health",
      "article",
      "wellness",
      "therapy",
      "EZZ Freedom and Hope",
    ],
  };
}

async function ArticleDetails(props: { params: ArticlePageProps }) {
  const { slug } = await props.params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const article = await prisma.article.findFirst({
    where: {
      slug: slug,
    },
  });

  // Callback URL
  const callbackUrl = encodeURIComponent(`/article-details/${slug}` || "/");

  if (!article) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6">
        <div className="space-y-4 text-center">
          <FileText className="text-muted-foreground mx-auto" size={64} />
          <h1 className="text-2xl font-bold text-red-500">Article Not Found</h1>
          <p className="text-muted-foreground">
            The article you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
        <Button className="rounded-full" asChild>
          <Link href="/articles">
            <ArrowLeft className="mr-2" size={16} />
            Browse All Articles
          </Link>
        </Button>
      </div>
    );
  }

  const hasPurchased = session?.user?.id
    ? Boolean(
        await prisma.userPurchase.findFirst({
          where: { userId: session.user.id, articleId: article.id },
          select: { id: true },
        }),
      )
    : false;

  // Free articles: grant library access for logged-in users (no checkout).
  if (session?.user?.id && article.price === 0 && !hasPurchased) {
    await prisma.userPurchase.upsert({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId: article.id,
        },
      },
      create: {
        userId: session.user.id,
        itemType: TransactionType.ARTICLE,
        articleId: article.id,
      },
      update: {},
    });
  }

  const ownsArticle =
    hasPurchased || Boolean(session?.user?.id && article.price === 0);

  const readerHref = article.r2Key
    ? `/reader/article/${article.id}`
    : "/dashboard/library";

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-muted-foreground flex items-center space-x-2 text-sm">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/articles" className="hover:text-primary">
          Articles
        </Link>
        <span>/</span>
        <span className="text-foreground">{article.title}</span>
      </nav>

      {/* Main Content Grid */}
      <div className="grid gap-8 xl:grid-cols-[400px_1fr]">
        {/* Left Column - Article Cover and Actions */}
        <div className="space-y-6">
          {/* Article Cover */}
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="relative aspect-4/5 w-full">
              <Image
                src={normalizeImageSrc(article.coverImage)}
                alt={`${article.title} - Mental Health Article`}
                className="object-cover"
                fill
                priority
              />
              {/* Price Badge */}
              <div className="absolute top-3 right-3">
                <Badge
                  className={`${article.price === 0 ? "bg-green-500" : "bg-primary"} rounded-full text-white shadow-lg backdrop-blur-xs`}
                >
                  {article.price === 0 ? "FREE" : `KES ${article.price}`}
                </Badge>
              </div>
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <Badge className="text-primary bg-white/90 shadow-lg backdrop-blur-xs">
                  <Tag size={12} className="mr-1" />
                  Article
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Access Card */}
          <Card className="border-primary/20 from-primary/5 to-primary/5 bg-linear-to-br">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2 text-center">
                <p className="text-primary text-2xl font-bold">
                  {article.price === 0 ? "Free Read" : `KES ${article.price}`}
                </p>
                <p className="text-muted-foreground text-sm">Digital Article</p>
              </div>

              {/* Access Button */}
              {ownsArticle ? (
                <Button
                  size="lg"
                  className="from-primary to-primary/70 hover:from-primary/80 hover:to-primary/60 w-full transform rounded-full bg-linear-to-r text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  asChild
                >
                  <Link
                    href={readerHref}
                    className="flex items-center justify-center gap-2"
                  >
                    <BookOpen size={20} />
                    <span className="font-semibold">
                      {article.r2Key ? "Read now" : "Go to Library"}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              ) : session?.session ? (
                <Button
                  size="lg"
                  className="from-primary to-primary/70 hover:from-primary/80 hover:to-primary/60 w-full transform rounded-full bg-linear-to-r text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  asChild
                >
                  <Link
                    href={`/article-checkout/${article.slug}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <FileText size={20} />
                    <span className="font-semibold">Purchase Article</span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="from-primary to-primary/70 hover:from-primary/80 hover:to-primary/60 w-full transform rounded-full bg-linear-to-r text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  asChild
                >
                  <Link
                    href={`/sign-in?callbackUrl=${callbackUrl}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Lock size={20} />
                    <span className="font-semibold">
                      Login to {article.price === 0 ? "Read" : "Purchase"}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              )}

              <p className="text-muted-foreground text-center text-xs">
                {ownsArticle
                  ? "You already own this article — open it in the secure reader."
                  : "Expert insights • Professional content • Evidence-based"}
              </p>
            </CardContent>
          </Card>

          {/* Article Features */}
          <Card className="border-0 shadow-md">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-foreground font-bold">Article Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Expert mental health insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Evidence-based information</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Professional writing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Practical guidance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Article Information */}
        <div className="space-y-8">
          {/* Article Header */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-primary">
                  Mental Health Article
                </Badge>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                  <span className="text-muted-foreground ml-1 text-sm">
                    (4.7 • Expert Content)
                  </span>
                </div>
              </div>

              <h1 className="text-foreground text-3xl font-bold md:text-4xl lg:text-5xl">
                {article.title}
              </h1>

              {/* Article Metadata */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    Published{" "}
                    {format(new Date(article.publishDate), "MMM yyyy")}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>Mental Health Expert</span>
                </div>
              </div>
            </div>

            {/* Article Content Preview */}
            <Card className="border-primary/20 from-primary/5 to-primary/5 bg-linear-to-br">
              <CardContent className="space-y-4 p-6">
                <h3 className="font-bold">Article Preview</h3>
                <div
                  className="prose prose-gray dark:prose-invert text-muted-foreground max-w-none text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.description }}
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-primary text-xl font-bold">Article</div>
                <div className="text-muted-foreground text-xs">Type</div>
              </div>

              <div className="text-center">
                <div className="text-primary text-xl font-bold">Expert</div>
                <div className="text-muted-foreground text-xs">Author</div>
              </div>
              <div className="text-center">
                <div className="text-primary text-xl font-bold">
                  {article.price === 0 ? "Free" : "Premium"}
                </div>
                <div className="text-muted-foreground text-xs">Access</div>
              </div>
            </div>
          </div>

          {/* Article Details Accordion */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="text-primary" size={24} />
                <h2 className="text-2xl font-bold">Article Information</h2>
              </div>
              <p className="text-muted-foreground">
                Detailed information about this mental health article
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="item-1"
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-primary" size={20} />
                      <span className="font-semibold">Publication Details</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        This article was published in{" "}
                        {format(new Date(article.publishDate), "MMM yyyy")} as
                        part of our ongoing commitment to providing quality
                        mental health resources and education.
                      </p>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="text-primary" size={16} />
                          <span>
                            Published{" "}
                            {format(new Date(article.publishDate), "MMM yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="text-primary" size={16} />
                          <span>Expert reviewed content</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-2">
                      <BookOpen className="text-primary" size={20} />
                      <span className="font-semibold">Access Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {article.price === 0
                        ? "This article is free to read in our secure in-app reader after you sign in. File downloads are not available."
                        : "After purchase, open this article in your library's secure in-app reader. File downloads are not available."}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Users className="text-primary" size={20} />
                      <span className="font-semibold">
                        Who Should Read This
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      This article is designed for individuals seeking mental
                      health insights, family members supporting loved ones,
                      mental health advocates, and anyone interested in
                      understanding and improving their mental wellness journey.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Related Content Suggestion */}
          <Card className="border-primary/20 from-primary/5 to-primary/5 bg-linear-to-r">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-bold">Continue Your Journey</h3>
              <p className="text-muted-foreground text-sm">
                Explore more mental health resources and expert guidance to
                support your wellness journey.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href="/articles">
                    <BookOpen size={16} className="mr-1" />
                    More Articles
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href="/services">
                    <Users size={16} className="mr-1" />
                    Our Services
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Call to Action */}
      <Card className="border-primary/20 from-primary/10 to-primary/10 bg-linear-to-r">
        <CardContent className="space-y-6 p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold md:text-3xl">
              Ready to Continue Your Mental Health Journey?
            </h3>
            <p className="text-muted-foreground mx-auto max-w-3xl">
              Access this valuable mental health content and explore our
              comprehensive resources designed to support your wellness and
              personal growth.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {ownsArticle ? (
              <Button
                size="lg"
                asChild
                className="bg-primary rounded-full px-8"
              >
                <Link href={readerHref} className="flex items-center gap-2">
                  <BookOpen size={20} />
                  {article.r2Key ? "Read Article Now" : "Open in Library"}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            ) : session?.session ? (
              <Button
                size="lg"
                asChild
                className="bg-primary rounded-full px-8"
              >
                <Link
                  href={`/article-checkout/${article.slug}`}
                  className="flex items-center gap-2"
                >
                  <FileText size={20} />
                  Get This Article
                  <ArrowRight size={16} />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                asChild
                className="from-primary to-primary/70 hover:from-primary/80 hover:to-primary/60 rounded-full bg-linear-to-r px-8"
              >
                <Link href={`/sign-in?callbackUrl=${callbackUrl}`}>
                  <Lock size={20} className="mr-2" />
                  Login to Access Content
                </Link>
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary text-primary hover:bg-primary rounded-full hover:text-white"
            >
              <Link href="/contact">
                <MessageCircle size={20} className="mr-2" />
                Get Professional Help
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 text-center md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-primary text-xl font-bold">
                Expert Content
              </div>
              <div className="text-muted-foreground text-sm">
                Written by mental health professionals
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-primary text-xl font-bold">
                Evidence-Based
              </div>
              <div className="text-muted-foreground text-sm">
                Backed by scientific research
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-primary text-xl font-bold">
                Practical Guidance
              </div>
              <div className="text-muted-foreground text-sm">
                Actionable insights for wellness
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ArticleDetails;
