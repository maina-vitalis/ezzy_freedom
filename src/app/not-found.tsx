import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md rounded-2xl p-8 shadow-lg">
        <h2 className="text-xl font-semibold text-red-600">
          Oops! Page Not Found
        </h2>
        <p className="mt-4 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <p className="mt-2 text-gray-500">
          At Ezzy Foundation, we&apos;re here to help. Let’s get you back on
          track.
        </p>
        <Button className="mt-5 rounded-full px-6 py-2 text-lg font-medium text-white shadow-md transition duration-300">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
