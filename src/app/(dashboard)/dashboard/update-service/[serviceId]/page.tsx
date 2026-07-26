import ServiceForm from "@/components/forms/ServiceForm";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type UpdateServiceProps = Promise<{
  serviceId: string;
}>;

export const metadata = {
  title: "Update Service – EZZ Freedom and Hope",
};

async function UpdateServicePage(props: { params: UpdateServiceProps }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/not-found");
  }

  const { serviceId } = await props.params;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    return (
      <div className="mt-5 text-center text-sm font-semibold text-destructive">
        Service not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Update Service</h1>
      <ServiceForm method="update" service={service} />
    </div>
  );
}

export default UpdateServicePage;
