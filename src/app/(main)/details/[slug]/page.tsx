import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";
// import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type ProductPageProps = Promise<{ slug: string }>;

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
  const callbackUrl = encodeURIComponent(`/details/${slug}` || "/");

  if (!book) {
    return (
      <div className="mt-5 flex flex-col items-center gap-5">
        <p className="text-center font-semibold text-red-500">No book found</p>
        <Button className="rounded-full" asChild>
          <Link href={"/"}>Go Back Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="relative flex flex-col gap-5 md:flex-row md:gap-10">
        <div className="space-y-1">
          <div className="relative h-56 w-full md:w-56">
            <Image
              src={book.coverImage}
              alt=""
              className="rounded-lg object-cover"
              fill
            />
          </div>
          <Button variant={"outline"} className="w-full rounded-full">
            {book.price} kes
          </Button>
          {session?.session ? (
            <Button className="w-full rounded-full hover:shadow-md" asChild>
              <Link href={`/checkout/${book.slug}`}>
                CheckOut
                <ArrowRight />
              </Link>
            </Button>
          ) : (
            <Button className="w-full rounded-full hover:shadow-md" asChild>
              <Link href={`/sign-in?callbackUrl=${callbackUrl}`}>
                Login to checkout
              </Link>
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex-1 space-y-5">
            <h2 className="text-3xl font-semibold capitalize">{book.title}</h2>

            <p className="text-sm">{book.bookOverview}</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Highlights</AccordionTrigger>
              <AccordionContent className="text-sm">
                <div
                  dangerouslySetInnerHTML={{ __html: book.highlights }}
                ></div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Additional information</AccordionTrigger>
              <AccordionContent className="text-sm">
                {book.additionalInfo}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Target audience</AccordionTrigger>
              <AccordionContent className="text-sm">
                {book.additionalInfo}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Related books</h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCard key={index} />
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default ProductDetails;
