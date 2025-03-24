import Image from "next/image";
import CheckOutForm from "@/components/forms/CheckOutForm";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type CheckOutProps = Promise<{ slug: string }>;

async function CheckOut(props: { params: CheckOutProps }) {
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

  // Get query parameter 'type' from the URL
  const headerList = await headers();
  const referer = headerList.get("referer") || "";
  const url = new URL(referer, "http://localhost:3000"); // Base URL for local dev
  const type = (url.searchParams.get("type") || "book") as "book" | "article"; // Default to "book" if type is missing

  // Fetch item based on type
  let item;
  if (type === "article") {
    item = await prisma.article.findFirst({
      where: { slug },
    });
  } else {
    // Default to book
    item = await prisma.books.findFirst({
      where: { slug },
    });
  }

  if (!item) {
    return (
      <div className="mt-5 flex flex-col items-center gap-5">
        <p className="text-center font-semibold text-red-500">
          No {type === "article" ? "article" : "book"} found
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
            src={item.coverImage}
            alt={item.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="flex-1">
          <CheckOutForm user={user} item={item} type={type} />
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
