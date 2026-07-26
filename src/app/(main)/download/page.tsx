import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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
