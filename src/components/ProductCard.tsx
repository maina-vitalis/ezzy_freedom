import { Books } from "@/generated/prisma/client";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { normalizeImageSrc } from "@/lib/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

interface ProductCardProps {
  book: Books;
}

function ProductCard({ book }: ProductCardProps) {
  return (
    <Card className="group bg-background overflow-hidden border-0 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <Link href={`/book-details/${book.slug}`}>
          <AspectRatio ratio={16 / 10} className="relative">
            <Image
              src={normalizeImageSrc(book.coverImage)}
              alt={book.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Floating Action */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
              <Button
                size="sm"
                className="rounded-full bg-white/90 px-4 py-2 text-black shadow-lg hover:bg-white"
                asChild
              >
                <Link
                  href={`/book-details/${book.slug}`}
                  className="flex items-center gap-2"
                >
                  <span className="font-medium">View Details</span>
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          </AspectRatio>
        </Link>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary/90 text-white shadow-lg backdrop-blur-xs">
            {book.price} KES
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-3 p-6">
        <div className="space-y-2">
          <h3 className="group-hover:text-primary line-clamp-2 text-lg leading-tight font-bold transition-colors duration-300">
            {book.title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {book.bookOverview}
          </p>
        </div>

        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className="fill-current" />
          ))}
          <span className="text-muted-foreground ml-1 text-xs">(4.8)</span>
        </div>
      </CardContent>

      <CardFooter className="space-y-3 p-6 pt-0">
        <Button
          asChild
          className="from-primary/30 to-primary/5 w-full rounded-full bg-linear-to-r text-white shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <Link
            href={`/book-details/${book.slug}`}
            className="flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            <span className="font-medium">Get This Book</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
