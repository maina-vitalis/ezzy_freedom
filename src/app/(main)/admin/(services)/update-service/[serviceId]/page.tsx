import ServiceForm from "@/components/forms/ServiceForm";
import prisma from "@/lib/prisma";
type UpdateBookProps = Promise<{
  serviceId: string;
}>;

async function UpdateService(props: { params: UpdateBookProps }) {
  const { serviceId } = await props.params;

  //fetch book
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!service) {
    return (
      <div className="mt-5 text-center text-sm font-semibold">
        No Service found
      </div>
    );
  }
  return (
    <div>
      <ServiceForm method="update" service={service} />
    </div>
  );
}

export default UpdateService;
