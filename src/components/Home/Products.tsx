import prisma from "@/lib/prisma";
import { ArrowRight, BookOpen, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../ProductCard";
import { Button } from "../ui/button";
import empty from "./../../assets/empty.png";

async function Products() {
  const books = await prisma.books.findMany({
    take: 3, // Limit to 3 books for home page
    orderBy: {
      id: "desc", // Show newest books first
    },
  });

  if (!books || books.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6">
            <BookOpen className="mx-auto text-muted-foreground" size={64} />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            Therapeutic Reads: Transform Your Mind
          </h2>
          <p className="mb-6 text-muted-foreground">
            Our collection of transformative books is coming soon. Check back
            later for inspiring reads that will guide your journey to mental
            wellness.
          </p>
          <Image
            src={empty}
            alt="No books available"
            height={80}
            width={80}
            className="mx-auto opacity-50"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <BookOpen className="text-primary" size={28} />
          <span className="text-sm font-medium uppercase tracking-wide text-primary">
            Featured Collection
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Therapeutic Reads: Transform Your Mind
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Discover powerful books designed to guide your journey toward mental
          wellness, personal growth, and emotional healing.
        </p>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div key={book.id} className="group">
            <ProductCard book={book} />
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="pt-8 text-center">
        <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 to-primary/10 p-6 sm:flex-row">
          <div className="flex items-center gap-2 text-primary">
            <Star className="fill-current" size={20} />
            <span className="font-medium">Discover More Healing Resources</span>
            <Star className="fill-current" size={20} />
          </div>
          <Button
            asChild
            className="transform rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Link href="/books" className="flex items-center gap-2">
              View All Books
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Products;
