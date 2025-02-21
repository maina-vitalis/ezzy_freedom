import Image from "next/image";
import { redirect } from "next/navigation";
import image from "./../../../assets/login-image.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function Download() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) redirect("/sign-in");

  return (
    <div className="flex flex-col-reverse gap-8 md:flex-row items-center p-8 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h1 className="text-4xl font-bold text-primary">Thank You! 🎉</h1>
        <p className="text-xl text-gray-700">
          Your book has been sent to your email. <br />
          <span className="font-semibold text-primary">
            Please check your inbox.
          </span>
        </p>

        <p className="text-gray-600">
          If you don’t receive the email within a few minutes, please check your
          spam folder or try contacting the{" "}
          <Link
            href="mailto:mainavitalis65@gmail.com"
            className="text-blue-600 underline"
          >
            support centre
          </Link>
          .
        </p>

        <Button
          variant={"outline"}
          className="rounded-full px-6 py-3 text-lg shadow-md"
        >
          <Link href="/">Go to Home</Link>
        </Button>
      </div>

      <div className="flex-1 relative min-h-60 md:min-h-80">
        <Image
          src={image}
          alt="Book image"
          fill
          className="object-cover rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}

export default Download;
