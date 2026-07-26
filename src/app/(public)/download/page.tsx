import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function Download() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) redirect("/sign-in");

  // Redirect to the unified dashboard library page
  redirect("/dashboard/library");
}

export default Download;
