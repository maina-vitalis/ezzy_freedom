import { Metadata } from "next";
import React, { Suspense } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "login",
};

async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.session) redirect("/");
  return (
    <main className="flex h-fit items-center justify-center p-2">
      <div className="flex h-full max-h-160 w-full max-w-5xl overflow-hidden rounded-2xl bg-card">
        <div className="w-full space-y-10 overflow-y-auto md:w-1/2 md:p-8">
          <h1 className="text-center text-xl font-bold md:text-2xl">
            Login to
            <br />
            <span className="text-primary">
              Ezz freedom and hope foundation
            </span>
          </h1>

          <Suspense
            fallback={<p className="mt-5 text-center font-semibold">loading</p>}
          >
            <div className="space-y-5">
              <LoginForm />
              <p className="text-center">
                <Link
                  href={"/sign-up"}
                  className="text-primary hover:underline"
                >
                  Don&apos;t have an account? Sign Up
                </Link>
              </p>
            </div>
          </Suspense>
        </div>
        <div className="relative hidden w-1/2 md:block">
          <Image
            src={
              "https://35jq5szehk.ufs.sh/f/tNU9RDFz3KoO3GPIudvAnPMR4odx8NbJrtLpEIF1i0lc2XuU"
            }
            alt=""
            className="hidden w-1/2 object-cover md:block"
            fill
          />
        </div>
      </div>
    </main>
  );
}

export default page;
