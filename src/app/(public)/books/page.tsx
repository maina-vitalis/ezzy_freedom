import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import {
  ArrowRight,
  Award,
  BookOpen,
  CircleCheck,
  Download,
  Heart,
  Shield,
  ShoppingCart,
  Star,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Mental Health Books & Resources - EZZ Freedom and Hope",
  description:
    "Explore our comprehensive collection of mental health books and resources. Expert-authored guides for healing, recovery, and personal growth.",
  openGraph: {
    title: "Mental Health Books & Resources",
    description:
      "Expert mental health books and resources for healing and recovery",
  },
};

async function Books() {
  const books = await prisma.books.findMany({
    orderBy: {
      id: "desc",
    },
  });

  // Separate free and paid books for better organization
  const freeBooks = books.filter((book) => book.price === 0);

  const paidBooks = books.filter((book) => book.price > 0);

  if (books.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6">
        <div className="space-y-4 text-center">
          <BookOpen className="mx-auto text-muted-foreground" size={64} />
          <h1 className="text-2xl font-bold md:text-3xl">
            No Books Available Yet
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            Our expert mental health books are being prepared. Check back soon
            for valuable resources on healing and recovery.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8">
      {/* Header Section */}
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="mb-2 flex items-center justify-center gap-2">
            <BookOpen className="text-primary" size={28} />
            <span className="text-sm font-medium uppercase tracking-wide text-primary">
              Mental Health Resources
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Books & Digital Resources
          </h1>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-muted-foreground">
            Discover our expertly crafted collection of mental health books and
            resources. Each publication is designed to provide guidance, hope,
            and practical wisdom for your healing journey.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Target size={16} />
            <span>{books.length} Expert Books</span>
          </div>
          <div className="flex items-center gap-2">
            <Download size={16} />
            <span>{freeBooks.length} Free Resources</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} />
            <span>Professional Authors</span>
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-primary/5">
          <CardContent className="space-y-3 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="text-primary" size={24} />
            </div>
            <h3 className="font-bold">Recovery Guides</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive guides for addiction recovery and mental wellness
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-primary/5">
          <CardContent className="space-y-3 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="text-primary" size={24} />
            </div>
            <h3 className="font-bold">Family Support</h3>
            <p className="text-sm text-muted-foreground">
              Resources for families supporting loved ones in recovery
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-primary/5">
          <CardContent className="space-y-3 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="text-primary" size={24} />
            </div>
            <h3 className="font-bold">Prevention</h3>
            <p className="text-sm text-muted-foreground">
              Educational materials for prevention and early intervention
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-primary/5">
          <CardContent className="space-y-3 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Target className="text-primary" size={24} />
            </div>
            <h3 className="font-bold">Personal Growth</h3>
            <p className="text-sm text-muted-foreground">
              Self-help and personal development for mental wellness
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Free Books Section */}
      {freeBooks.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Free Resources</h2>
            <p className="mt-2 text-muted-foreground">
              Start your journey with our complimentary mental health resources
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {freeBooks.map((book) => (
              <Card
                key={book.id}
                className="group overflow-hidden border-0 bg-primary/20 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Book Cover */}
                <div className="relative h-64 overflow-hidden">
                  <Link href={`/book-details/${book.slug}`}>
                    <Image
                      src={book.coverImage}
                      alt={`${book.title} - Free Mental Health Resource`}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      fill
                    />
                    {/* Free Badge */}
                    <div className="absolute right-3 top-3">
                      <Badge className="rounded-full bg-green-500 text-white shadow-lg backdrop-blur-xs">
                        FREE
                      </Badge>
                    </div>

                    {/* Floating Action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <Button
                        size="sm"
                        className="rounded-full bg-white/90 px-6 py-2 text-primary shadow-lg hover:bg-white"
                        asChild
                      >
                        <Link
                          href={`/book-details/${book.slug}`}
                          className="flex items-center gap-2"
                        >
                          <span className="font-medium">Read More</span>
                          <ArrowRight size={14} />
                        </Link>
                      </Button>
                    </div>
                  </Link>
                </div>

                {/* Content */}
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-3">
                    <Link href={`/book-details/${book.slug}`}>
                      <h3 className="line-clamp-2 text-lg font-bold leading-tight transition-colors duration-300 group-hover:text-primary">
                        {book.title}
                      </h3>
                    </Link>

                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {book.bookOverview}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-current" />
                      ))}
                      <span className="ml-1 text-xs text-muted-foreground">
                        (4.8)
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    asChild
                    className="w-full rounded-full bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl"
                  >
                    <Link
                      href={`/book-details/${book.slug}`}
                      className="flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      <span className="font-medium">Get Free Book</span>
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Premium Books Section */}
      {paidBooks.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Premium Collection
            </h2>
            <p className="mt-2 text-muted-foreground">
              In-depth resources with comprehensive mental health guidance
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paidBooks.map((book) => (
              <Card
                key={book.id}
                className="group overflow-hidden border-0 bg-primary/20 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Book Cover */}
                <div className="relative h-64 overflow-hidden">
                  <Link href={`/book-details/${book.slug}`}>
                    <Image
                      src={book.coverImage}
                      alt={`${book.title} - Premium Mental Health Resource`}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      fill
                    />
                    {/* Price Badge */}
                    <div className="absolute right-3 top-3">
                      <Badge className="rounded-full bg-primary text-white shadow-lg backdrop-blur-xs">
                        KES {book.price}
                      </Badge>
                    </div>

                    {/* Premium Badge */}
                    <div className="absolute left-3 top-3">
                      <Badge className="rounded-full bg-yellow-500 text-white shadow-lg backdrop-blur-xs">
                        <Award size={12} className="mr-1" />
                        Premium
                      </Badge>
                    </div>

                    {/* Floating Action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <Button
                        size="sm"
                        className="rounded-full bg-white/90 px-6 py-2 text-primary shadow-lg hover:bg-white"
                        asChild
                      >
                        <Link
                          href={`/book-details/${book.slug}`}
                          className="flex items-center gap-2"
                        >
                          <span className="font-medium">Learn More</span>
                          <ArrowRight size={14} />
                        </Link>
                      </Button>
                    </div>
                  </Link>
                </div>

                {/* Content */}
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-3">
                    <Link href={`/book-details/${book.slug}`}>
                      <h3 className="line-clamp-2 text-lg font-bold leading-tight transition-colors duration-300 group-hover:text-primary">
                        {book.title}
                      </h3>
                    </Link>

                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {book.bookOverview}
                    </p>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CircleCheck size={12} />
                        <span>Expert Written</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download size={12} />
                        <span>Instant Access</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-current" />
                      ))}
                      <span className="ml-1 text-xs text-muted-foreground">
                        (4.9)
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    asChild
                    className="w-full rounded-full bg-linear-to-r from-primary to-primary/70 text-white shadow-lg transition-all duration-300 hover:from-primary/80 hover:to-primary/60 hover:shadow-xl"
                  >
                    <Link
                      href={`/book-details/${book.slug}`}
                      className="flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      <span className="font-medium">View Details</span>
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action Section */}
      <Card className="border-primary/20 bg-linear-to-r from-primary/10 to-primary/10">
        <CardContent className="space-y-6 p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold md:text-3xl">
              Start Your Mental Health Journey Today
            </h3>
            <p className="mx-auto max-w-3xl text-muted-foreground">
              Explore our comprehensive collection of mental health resources
              designed to support your healing, growth, and recovery. From free
              introductory guides to in-depth premium resources, find the
              perfect book for your journey.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-linear-to-r from-primary to-primary/70 px-8 hover:from-primary/80 hover:to-primary/60"
            >
              <Link href="/contact" className="flex items-center gap-2">
                <Heart size={20} />
                Get Professional Help
                <ArrowRight size={16} />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Link href="/services" className="flex items-center gap-2">
                <Users size={20} />
                Explore Our Services
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 text-center md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-xl font-bold text-primary">
                Expert Authors
              </div>
              <div className="text-sm text-muted-foreground">
                Licensed mental health professionals
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-primary">
                Evidence-Based
              </div>
              <div className="text-sm text-muted-foreground">
                Research-backed content and methods
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-primary">
                Instant Access
              </div>
              <div className="text-sm text-muted-foreground">
                Download immediately after purchase
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Books;
