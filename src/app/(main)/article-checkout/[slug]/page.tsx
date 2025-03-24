import Image from "next/image";
import CheckOutForm from "@/components/forms/CheckOutForm";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type CheckOutProps = Promise<{ slug: string }>;

async function ArticleCheckOut(props: { params: CheckOutProps }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Get the current path with query parameters
  const currentPath = encodeURIComponent(
    (await headers()).get("referer") || "/",
  );

  if (!session?.user) redirect(`/sign-in?callbackUrl=${currentPath}`);

  // User prop data
  const user = {
    email: session?.user.email,
    name: session?.user.name,
  };

  const { slug } = await props.params;

  // Fetch item based on type
  const article = await prisma.article.findFirst({
    where: { slug },
  });

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
    <div className="space-y-5">
      <h2 className="text-center text-lg font-semibold md:text-2xl">
        Proceed to Checkout
      </h2>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="relative min-h-52 flex-1 rounded-lg">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="flex-1">
          <CheckOutForm
            user={user}
            item={{
              id: article.id,
              price: article.price,
              title: article.title,
            }}
            type={"article"}
          />
        </div>
      </div>
    </div>
  );
}

export default ArticleCheckOut;
