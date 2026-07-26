import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminAppointmentsView from "./AdminAppointmentsView";
import UserAppointmentsView from "./UserAppointmentsView";

export const metadata = {
  title: "Appointments – EZZ Freedom and Hope",
};

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  if (session.user.role === "ADMIN") {
    return <AdminAppointmentsView />;
  }

  return <UserAppointmentsView />;
}
