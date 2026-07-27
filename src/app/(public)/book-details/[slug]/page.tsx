import { TransactionType } from "@/generated/prisma/client";
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
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Heart,
  Lock,
  Shield,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type ProductPageProps = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: ProductPageProps }) {
  const { slug } = await props.params;
  const book = await prisma.books.findFirst({
    where: {
      slug,
    },
  });
  if (!book) redirect(notFound());

  return {
    title: `${book.title} - EZZ Freedom and Hope`,
    description: book.bookOverview,
    openGraph: {
      title: book.title,
      description: book.bookOverview,
      images: [book.coverImage],
    },
  };
}

async function ProductDetails(props: { params: ProductPageProps }) {
  const { slug } = await props.params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const book = await prisma.books.findFirst({
    where: {
      slug: slug,
    },
  });

  //callback url
  const callbackUrl = encodeURIComponent(`/book-details/${slug}` || "/");

  const hasPurchased =
    session?.user?.id && book
      ? Boolean(
          await prisma.userPurchase.findFirst({
            where: { userId: session.user.id, bookId: book.id },
            select: { id: true },
          }),
        )
      : false;

  // Free books: grant library access for logged-in users (no checkout).
  if (session?.user?.id && book && book.price === 0 && !hasPurchased) {
    await prisma.userPurchase.upsert({
      where: {
        userId_bookId: { userId: session.user.id, bookId: book.id },
      },
      create: {
        userId: session.user.id,
        itemType: TransactionType.BOOK,
        bookId: book.id,
      },
      update: {},
    });
  }

  const ownsBook =
    hasPurchased ||
    Boolean(session?.user?.id && book && book.price === 0);

  if (!book) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6">
        <div className="space-y-4 text-center">
          <BookOpen className="mx-auto text-muted-foreground" size={64} />
          <h1 className="text-2xl font-bold text-red-500">Book Not Found</h1>
          <p className="text-muted-foreground">
            The book you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
        <Button className="rounded-full" asChild>
          <Link href={"/"}>
            <ArrowLeft className="mr-2" size={16} />
            Go Back Home
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
        <Link href="books" className="hover:text-primary">
          Books
        </Link>
        <span>/</span>
        <span className="text-foreground">{book.title}</span>
      </nav>

      {/* Main Content Grid */}
      <div className="grid gap-8 xl:grid-cols-[400px_1fr]">
        {/* Left Column - Book Cover and Actions */}
        <div className="space-y-6">
          {/* Book Cover */}
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="relative aspect-3/4 w-full">
              <Image
                src={book.coverImage}
                alt={book.title}
                className="object-cover"
                fill
                priority
              />
              {/* Price Badge */}
              <div className="absolute right-3 top-3">
                <Badge
                  className={`${book.price === 0 ? "bg-green-500" : "bg-primary"} rounded-full text-white shadow-lg backdrop-blur-xs`}
                >
                  {book.price === 0 ? "FREE" : `KES ${book.price}`}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Purchase Card */}
          <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-primary/5">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2 text-center">
                <p className="text-2xl font-bold text-primary">
                  {book.price === 0 ? "Free to Read" : `KES ${book.price}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Digital PDF Format
                </p>
              </div>

              {/* Purchase / owned actions */}
              {ownsBook ? (
                <Button
                  size="lg"
                  className="w-full transform rounded-full bg-linear-to-r from-primary to-primary/70 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:to-primary/60 hover:shadow-xl"
                  asChild
                >
                  <Link
                    href={
                      book.r2Key
                        ? `/reader/${book.id}`
                        : "/dashboard/library"
                    }
                    className="flex items-center justify-center gap-2"
                  >
                    <BookOpen size={20} />
                    <span className="font-semibold">
                      {book.r2Key ? "Read now" : "Go to Library"}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              ) : session?.session ? (
                  <Button
                    size="lg"
                    className="w-full transform rounded-full bg-linear-to-r from-primary to-primary/70 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:to-primary/60 hover:shadow-xl"
                    asChild
                  >
                    <Link
                      href={`/book-checkout/${book.slug}`}
                      className="flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      <span className="font-semibold">Purchase Now</span>
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full transform rounded-full bg-linear-to-r from-primary to-primary/70 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:to-primary/60 hover:shadow-xl"
                  asChild
                >
                  <Link
                    href={`/sign-in?callbackUrl=${callbackUrl}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Lock size={20} />
                    <span className="font-semibold">
                      Login to {book.price === 0 ? "Read" : "Purchase"}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              )}

              <p className="text-center text-xs text-muted-foreground">
                {ownsBook
                  ? "You already own this book — open it in the secure reader."
                  : "Secure checkout • 30-day money-back guarantee • Instant access"}
              </p>
            </CardContent>
          </Card>

          {/* Features List */}
          <Card className="border-0 shadow-md">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-bold text-foreground">
                What&apos;s Included
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Instant access in the in-app reader</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Lifetime access to content</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Expert mental health guidance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Book Information */}
        <div className="space-y-8">
          {/* Book Header */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-primary">
                  Mental Health Resource
                </Badge>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                  <span className="ml-1 text-sm text-muted-foreground">
                    (4.8 • 127 reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                {book.title}
              </h1>

              <p className="text-base leading-relaxed text-muted-foreground">
                {book.bookOverview}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">PDF</div>
                <div className="text-xs text-muted-foreground">Format</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">4.8</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">127</div>
                <div className="text-xs text-muted-foreground">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">Readers</div>
              </div>
            </div>
          </div>

          {/* Book Details Accordion */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="text-primary" size={24} />
                <h2 className="text-2xl font-bold">Book Details</h2>
              </div>
              <p className="text-muted-foreground">
                Comprehensive information about this mental health resource
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
                      <BookOpen className="text-primary" size={20} />
                      <span className="font-semibold">Book Overview</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-4">
                    <div
                      className="prose prose-gray dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: book.highlights }}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-primary" size={20} />
                      <span className="font-semibold">
                        Additional Information
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-4">
                    <p className="leading-relaxed text-muted-foreground">
                      {book.additionalInfo}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Users className="text-primary" size={20} />
                      <span className="font-semibold">Target Audience</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-4">
                    <p className="leading-relaxed text-muted-foreground">
                      {book.targetAudience}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Author & Quality Assurance */}
          <Card className="border-primary/20 bg-linear-to-r from-primary/5 to-primary/5">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-bold">Quality Assurance</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="text-primary" size={16} />
                    <span className="text-sm font-medium">Expert Reviewed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="text-primary" size={16} />
                    <span className="text-sm font-medium">
                      Professional Author
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="text-primary" size={16} />
                    <span className="text-sm font-medium">
                      Recently Updated
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="text-primary" size={16} />
                    <span className="text-sm font-medium">Evidence-Based</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Call to Action */}
      <Card className="border-primary/20 bg-linear-to-r from-primary/10 to-primary/10">
        <CardContent className="space-y-6 p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold md:text-3xl">
              Ready to Transform Your Mental Health?
            </h3>
            <p className="mx-auto max-w-3xl text-muted-foreground">
              Join thousands of readers who have found hope and healing through
              our expertly crafted mental health resources. Take the first step
              toward better mental wellness today.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {ownsBook ? (
              <Button
                size="lg"
                asChild
                className="rounded-full bg-linear-to-r from-primary to-primary/70 px-8 hover:from-primary/80 hover:to-primary/60"
              >
                <Link
                  href={
                    book.r2Key ? `/reader/${book.id}` : "/dashboard/library"
                  }
                  className="flex items-center gap-2"
                >
                  <BookOpen size={20} />
                  {book.r2Key ? "Read now" : "Open in Library"}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            ) : session?.session ? (
              <Button
                size="lg"
                asChild
                className="rounded-full bg-linear-to-r from-primary to-primary/70 px-8 hover:from-primary/80 hover:to-primary/60"
              >
                <Link
                  href={`/book-checkout/${book.slug}`}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Get This Book Now
                  <ArrowRight size={16} />
                </Link>
              </Button>
            ) : (
              <Button
                size="lg"
                asChild
                className="rounded-full bg-linear-to-r from-primary to-primary/70 px-8 hover:from-primary/80 hover:to-primary/60"
              >
                <Link href={`/sign-in?callbackUrl=${callbackUrl}`}>
                  <Lock size={20} className="mr-2" />
                  Login to Get Started
                </Link>
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Link href="/books">
                <ArrowLeft size={20} className="mr-2" />
                Browse More Books
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 text-center md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-xl font-bold text-primary">
                Instant Access
              </div>
              <div className="text-sm text-muted-foreground">
                Open in the secure reader after purchase
              </div>
            </div>
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
                Lifetime Access
              </div>
              <div className="text-sm text-muted-foreground">
                Keep forever, no recurring fees
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductDetails;
