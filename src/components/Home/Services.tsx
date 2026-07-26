import prisma from "@/lib/prisma";
import { ArrowRight, Heart, Users } from "lucide-react";
import Link from "next/link";
import SessionComponent from "../SessionComponent";
import { Button } from "../ui/button";

async function Services() {
  const services = await prisma.service.findMany({
    take: 4, // Limit to 4 services for home page
    orderBy: {
      id: "desc",
    },
  });

  if (!services || services.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6">
            <Heart className="mx-auto text-muted-foreground" size={64} />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            Our Professional Services
          </h2>
          <p className="mb-6 text-muted-foreground">
            Our comprehensive mental health services are being prepared. Check
            back soon for professional support options.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Heart className="text-primary" size={28} />
          <span className="text-sm font-medium uppercase tracking-wide text-primary">
            Professional Care
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Our Specialized Services
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          Comprehensive mental health and wellness services tailored to your
          unique needs. Our evidence-based approaches ensure effective treatment
          and lasting recovery.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {services.map((item) => (
          <SessionComponent key={item.id} item={item} />
        ))}
      </div>

      {/* Call to Action */}
      <div className="pt-8 text-center">
        <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/10 p-6 sm:flex-row">
          <div className="flex items-center gap-2 text-primary">
            <Users className="fill-current" size={20} />
            <span className="font-medium">Discover All Our Services</span>
            <Users className="fill-current" size={20} />
          </div>
          <Button
            asChild
            className="transform rounded-full px-6 py-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Link href="/services" className="flex items-center gap-2">
              View All Services
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Services;
