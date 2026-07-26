import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Library } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Download() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) redirect("/sign-in");

  // Redirect to the new library page
  redirect(`/users/${session.user.name}/library`);
}

export default Download;
