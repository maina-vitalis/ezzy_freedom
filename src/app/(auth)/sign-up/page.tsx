import { Metadata } from "next";
import signupImage from "./../../../assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "./SignupForm";
import logo from "./../../../assets/logo.png";

export const metadata: Metadata = {
  title: "Sign up",
};

function page() {
  return (
    <main className="flex h-screen items-center justify-center p-2">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-xl bg-card">
        <div className="w-full space-y-10 overflow-y-auto p-8 md:w-1/2">
          <div className="space-y-1 text-center">
            <Image
              src={logo}
              alt="ezz freedom and hope logo "
              className="mx-auto object-cover"
              height={100}
              width={100}
            />
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
