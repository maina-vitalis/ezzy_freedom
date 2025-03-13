import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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
    title: `${book.title}`,
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
    <div className="space-y-10 md:px-28">
      <div className="relative flex flex-col gap-5 md:flex-row md:gap-10">
        <div>
          <div className="relative h-56 w-full md:h-full md:w-72">
            <Image
              src={book.coverImage}
              alt=""
              className="rounded-lg object-cover"
              fill
            />
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex-1 space-y-5">
            <h2 className="text-lg font-semibold capitalize md:text-2xl">
              {book.title}
            </h2>

            <p className="text-sm">{book.bookOverview}</p>
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
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
        </div>
      </div>

      <div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Book Overview</AccordionTrigger>
            <AccordionContent className="text-sm">
              <p
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: book.highlights }}
              ></p>
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
              {book.targetAudience}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default ProductDetails;
