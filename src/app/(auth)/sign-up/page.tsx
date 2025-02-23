import { Metadata } from "next";
import signupImage from "./../../../assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "./SignupForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign up",
};

async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.session) redirect("/");
  return (
    <main className="flex h-fit items-center justify-center p-2">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-xl bg-card">
        <div className="w-full space-y-10 overflow-y-auto p-8 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-center text-xl font-bold">
              Register to
              <br />
              <span className="text-primary">
                Ezz freedom and hope foundation
              </span>
            </h1>
          </div>
          <div className="space-y-5">
            <SignupForm />
            <Link
              href={"/sign-in"}
              className="block text-center text-blue-500 hover:underline"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
          objectFit="cover"
        />
      </div>
    </main>
  );
}

export default page;
