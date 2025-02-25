import prisma from "@/lib/prisma";
import Image from "next/image";

type ServiceDetailsProps = Promise<{
  slug: string;
}>;
async function ServiceDetails(props: { params: ServiceDetailsProps }) {
  const { slug } = await props.params;

  const service = await prisma.service.findFirst({
    where: {
      slug,
    },
  });
  if (!service) {
    return (
      <div className="text-center text-sm font-semibold">No Service found</div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="before: relative left-0 h-[40vh] from-primary to-transparent before:absolute before:top-0 before:z-10 before:h-full before:w-full before:rounded-lg before:bg-primary/50 before:content-[''] md:before:bg-transparent md:before:bg-gradient-to-r md:before:opacity-90">
        <Image
          src={service?.image}
          alt="Contact Us"
          fill
          className="rounded-lg object-cover"
        />
        <h1 className="absolute left-[50%] top-[40%] z-10 -translate-x-[50%] text-center text-2xl font-bold text-white">
          {service.name}
        </h1>
      </div>

      <div className="mx-auto w-full space-y-2 md:max-w-[900px]">
        <h2 className="text-center font-semibold sm:text-base md:text-xl">
          Description
        </h2>
        <p
          dangerouslySetInnerHTML={{ __html: service.description }}
          className="prose custom-html-content dark:prose-invert text-sm backdrop:blur-md"
        />
      </div>
    </div>
  );
}

export default ServiceDetails;
