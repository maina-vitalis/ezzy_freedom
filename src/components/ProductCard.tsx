import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AspectRatio } from "./ui/aspect-ratio";
import { Books } from "@prisma/client";

interface ProductCardProps {
  book: Books;
}

function ProductCard({ book }: ProductCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border-2 p-2 transition-all duration-300 hover:border-primary">
      <Link href={`/book-details/${book.slug}`}>
        <AspectRatio ratio={16 / 8} className="relative">
          <Image
            src={book.coverImage}
            alt={""}
            fill
            className="z-20 h-[230px] w-full rounded-md object-cover transition-all duration-300 group-hover:h-[200px]"
          />
        </AspectRatio>
      </Link>

      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-col justify-between gap-1">
          <p className="line-clamp-1 font-semibold capitalize md:text-lg">
            {book.title}
          </p>
          <p className="line-clamp-3 text-sm">{book.bookOverview}</p>
        </div>
        <div className="text- flex gap-3">
          <Badge className="rounded-full bg-primary">{book.price} KES</Badge>

          <Link href={`/book-details/${book.slug}`} className="flex-1">
            <Button
              variant={"outline"}
              className="w-full rounded-full bg-muted text-base font-semibold"
            >
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
