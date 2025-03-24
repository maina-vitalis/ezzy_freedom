import Image from "next/image";
import { redirect } from "next/navigation";
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
    <div className="flex flex-col-reverse items-center gap-8 rounded-lg p-8 shadow-lg md:flex-row">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h1 className="text-4xl font-bold text-primary">Thank You! 🎉</h1>
        <p className="text-xl">
          Your book/article has been sent to your email. <br />
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

      <div className="relative min-h-60 flex-1 md:min-h-80">
        <Image
          src={
            "https://35jq5szehk.ufs.sh/f/tNU9RDFz3KoODAVdXwaldt9LT13GxhcZ8POMubvmrUNeKB4H"
          }
          alt="Book image"
          fill
          className="rounded-lg object-cover shadow-md"
        />
      </div>
    </div>
  );
}

export default Download;
