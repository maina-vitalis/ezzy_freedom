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

  //get the current path
  const currentPath = encodeURIComponent(
    (await headers()).get("referer") || "/"
  );

  if (!session?.user) redirect(`/sign-in?callbackUrl=${currentPath}`);

  //user prop data
  const user = {
    email: session?.user.email,
    name: session?.user.name,
  };

  const { slug } = await props.params;

  const book = await prisma.books.findFirst({
    where: {
      slug: slug,
    },
  });

  if (!book) {
    return (
      <div className="mt-5 flex flex-col items-center gap-5">
        <p className=" text-red-500 font-semibold text-center">No book found</p>
        <Button className="rounded-full" asChild>
          <Link href={"/"}>Go Back Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="md:text-2xl text-lg font-semibold text-center">
        Proceed to Checkout
      </h2>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex-1 relative rounded-lg min-h-52">
          <Image
            src={book.coverImage}
            alt="book-name"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="flex-1">
          <CheckOutForm user={user} book={book} />
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
