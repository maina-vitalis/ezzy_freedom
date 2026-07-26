import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
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
          <FileText className="mx-auto text-muted-foreground" size={64} />
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

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
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
      <div className="grid gap-8 xl:grid-cols-[400px,1fr]">
        {/* Left Column - Article Cover and Actions */}
        <div className="space-y-6">
          {/* Article Cover */}
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={article.coverImage}
                alt={`${article.title} - Mental Health Article`}
                className="object-cover"
                fill
                priority
              />
              {/* Price Badge */}
              <div className="absolute right-3 top-3">
                <Badge
                  className={`${article.price === 0 ? "bg-green-500" : "bg-primary"} rounded-full text-white shadow-lg backdrop-blur-sm`}
                >
                  {article.price === 0 ? "FREE" : `KES ${article.price}`}
                </Badge>
              </div>
              {/* Category Badge */}
              <div className="absolute left-3 top-3">
                <Badge className="bg-white/90 text-primary shadow-lg backdrop-blur-sm">
                  <Tag size={12} className="mr-1" />
                  Article
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Access Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/5">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2 text-center">
                <p className="text-2xl font-bold text-primary">
                  {article.price === 0 ? "Free Read" : `KES ${article.price}`}
                </p>
                <p className="text-sm text-muted-foreground">Digital Article</p>
              </div>

              {/* Access Button */}
              {session?.session ? (
                <Button
                  size="lg"
                  className="w-full transform rounded-full bg-gradient-to-r from-primary to-primary/70 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:to-primary/60 hover:shadow-xl"
                  asChild
                >
                  <Link
                    href={
                      article.price === 0
                        ? article.downloadUrl
                        : `/article-checkout/${article.slug}`
                    }
                    className="flex items-center justify-center gap-2"
                  >
                    {article.price === 0 ? (
                      <Download size={20} />
                    ) : (
                      <FileText size={20} />
                    )}
                    <span className="font-semibold">
                      {article.price === 0 ? "Read Now" : "Purchase Article"}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full transform rounded-full bg-gradient-to-r from-primary to-primary/70 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:to-primary/60 hover:shadow-xl"
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

              <p className="text-center text-xs text-muted-foreground">
                Expert insights • Professional content • Evidence-based
              </p>
            </CardContent>
          </Card>

          {/* Article Features */}
          <Card className="border-0 shadow-md">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-bold text-foreground">Article Features</h3>
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
                  <span className="ml-1 text-sm text-muted-foreground">
                    (4.7 • Expert Content)
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                {article.title}
              </h1>

              {/* Article Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/5">
              <CardContent className="space-y-4 p-6">
                <h3 className="font-bold">Article Preview</h3>
                <div
                  className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: article.description }}
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">Article</div>
                <div className="text-xs text-muted-foreground">Type</div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-primary">Expert</div>
                <div className="text-xs text-muted-foreground">Author</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {article.price === 0 ? "Free" : "Premium"}
                </div>
                <div className="text-xs text-muted-foreground">Access</div>
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
                  <AccordionContent className="pb-6 pt-4">
                    <div className="space-y-4">
                      <p className="leading-relaxed text-muted-foreground">
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
                      <Download className="text-primary" size={20} />
                      <span className="font-semibold">Access Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-4">
                    <p className="leading-relaxed text-muted-foreground">
                      {article.price === 0
                        ? "This article is free to access upon login. Simply sign in to your account to read the full content and gain valuable mental health insights."
                        : "This premium article requires purchase to access the full content. After purchase, you'll receive immediate access to the complete article with expert mental health guidance."}
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
                  <AccordionContent className="pb-6 pt-4">
                    <p className="leading-relaxed text-muted-foreground">
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
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/5">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-bold">Continue Your Journey</h3>
              <p className="text-sm text-muted-foreground">
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
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/10">
        <CardContent className="space-y-6 p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold md:text-3xl">
              Ready to Continue Your Mental Health Journey?
            </h3>
            <p className="mx-auto max-w-3xl text-muted-foreground">
              Access this valuable mental health content and explore our
              comprehensive resources designed to support your wellness and
              personal growth.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {session?.session ? (
              <Button
                size="lg"
                asChild
                className="rounded-full bg-primary px-8"
              >
                <Link
                  href={
                    article.price === 0
                      ? article.downloadUrl
                      : `/article-checkout/${article.slug}`
                  }
                  className="flex items-center gap-2"
                >
                  {article.price === 0 ? (
                    <Download size={20} />
                  ) : (
                    <FileText size={20} />
                  )}
                  {article.price === 0
                    ? "Read Article Now"
                    : "Get This Article"}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                asChild
                className="rounded-full bg-gradient-to-r from-primary to-primary/70 px-8 hover:from-primary/80 hover:to-primary/60"
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
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Link href="/contact">
                <MessageCircle size={20} className="mr-2" />
                Get Professional Help
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 text-center md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-xl font-bold text-primary">
                Expert Content
              </div>
              <div className="text-sm text-muted-foreground">
                Written by mental health professionals
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-primary">
                Evidence-Based
              </div>
              <div className="text-sm text-muted-foreground">
                Backed by scientific research
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-primary">
                Practical Guidance
              </div>
              <div className="text-sm text-muted-foreground">
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
