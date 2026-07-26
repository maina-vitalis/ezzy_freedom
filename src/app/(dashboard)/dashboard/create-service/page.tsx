import ServiceForm from "@/components/forms/ServiceForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Add Service – EZZ Freedom and Hope",
};

async function CreateServicePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/not-found");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Add New Service</h1>
      <ServiceForm method="create" />
    </div>
  );
}

export default CreateServicePage;
