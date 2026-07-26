import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardView from "./AdminDashboardView";
import UserDashboardView from "./UserDashboardView";

export const metadata = {
  title: "Dashboard – EZZ Freedom and Hope",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role === "ADMIN") {
    return <AdminDashboardView />;
  }

  return (
    <UserDashboardView
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    />
  );
}
