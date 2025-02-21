import { Metadata } from "next";
import React, { Suspense } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
import loginImage from "../../../assets/login-image.jpg";
import Image from "next/image";

export const metadata: Metadata = {
  title: "login",
};

function page() {
  return (
    <main className="flex h-screen items-center justify-center p-2">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card">
        <div className="w-full space-y-10 overflow-y-auto p-8 md:w-1/2">
          <h1 className=" text-xl md:text-3xl font-bold">
            Login to Ezzy Foundation
          </h1>
          <Suspense
            fallback={<p className="text-center font-semibold mt-5">loading</p>}
          >
            <div className="space-y-5">
              <LoginForm />
              <p className="text-center">
                <Link href={"/sign-up"} className="hover:underline">
                  Don&apos;t have an account? Sign Up
                </Link>
              </p>
            </div>
          </Suspense>
        </div>
        <Image
          src={loginImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}

export default page;
