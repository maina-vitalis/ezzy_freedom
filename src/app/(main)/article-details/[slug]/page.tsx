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
    title: `${article.title}`,
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
      <div className="mt-5 flex flex-col items-center gap-5">
        <p className="text-center font-semibold text-red-500">
          No article found
        </p>
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
              src={article.coverImage}
              alt=""
              className="rounded-lg object-cover"
              fill
            />
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex-1 space-y-5">
            <h2 className="text-lg font-semibold capitalize md:text-xl">
              {article.title}
            </h2>
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: article.description }}
            ></p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:gap-5">
            <Button variant={"outline"} className="w-full rounded-full">
              {article.price === 0 ? "Free" : `${article.price} Kes`}
            </Button>
            {session?.session ? (
              <Button className="w-full rounded-full hover:shadow-md" asChild>
                <Link
                  href={
                    article.price === 0
                      ? article.downloadUrl
                      : `/article-checkout/${article.slug}`
                  }
                >
                  {article.price === 0 ? "Download" : "Checkout"}
                  <ArrowRight />
                </Link>
              </Button>
            ) : (
              <Button className="w-full rounded-full hover:shadow-md" asChild>
                <Link href={`/sign-in?callbackUrl=${callbackUrl}`}>
                  Login to {article.price === 0 ? "download" : "checkout"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger>Publish Month</AccordionTrigger>
            <AccordionContent className="text-sm">
              {article.publishMonth}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Download Information</AccordionTrigger>
            <AccordionContent className="text-sm">
              {article.price === 0
                ? "This article is free to download upon login."
                : "Purchase required to access the download link."}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default ArticleDetails;
