import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Shield,
  Star,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Professional Mental Health Services - EZZ Freedom and Hope",
  description:
    "Comprehensive mental health and wellness services tailored to your unique needs. Expert-led therapy, counseling, and addiction support programs.",
  openGraph: {
    title: "Professional Mental Health Services",
    description: "Expert mental health care and wellness services",
  },
};

async function Services() {
  const services = await prisma.service.findMany({
    orderBy: {
      id: "desc",
    },
  });

  if (services.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6">
        <div className="space-y-4 text-center">
          <Heart className="mx-auto text-muted-foreground" size={64} />
          <h1 className="text-2xl font-bold md:text-3xl">
            No Services Available
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            Our comprehensive mental health services are being prepared. Check
            back soon for professional support options.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8">
      {/* Header Section */}
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Heart className="text-primary" size={28} />
            <span className="text-sm font-medium uppercase tracking-wide text-primary">
              Professional Care
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Mental Health & Wellness Services
          </h1>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-muted-foreground">
            Comprehensive, evidence-based mental health services designed to
            support your journey toward healing, growth, and lasting wellness.
            Our expert team provides compassionate care tailored to your unique
            needs.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Target size={16} />
            <span>{services.length} Specialized Services</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>Expert Professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} />
            <span>Evidence-Based Care</span>
          </div>
        </div>
      </div>

      {/* Services Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/5">
          <CardContent className="space-y-3 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="text-primary" size={24} />
            </div>
            <h3 className="font-bold">Individual Therapy</h3>
            <p className="text-sm text-muted-foreground">
              One-on-one sessions tailored to your specific mental health needs
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/5">
          <CardContent className="space-y-3 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="text-primary" size={24} />
            </div>
            <h3 className="font-bold">Group Support</h3>
            <p className="text-sm text-muted-foreground">
              Community-based healing with peer support and shared experiences
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/5">
          <CardContent className="space-y-3 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="text-primary" size={24} />
            </div>
            <h3 className="font-bold">Crisis Support</h3>
            <p className="text-sm text-muted-foreground">
              24/7 emergency support for mental health crises and urgent needs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Services Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Our Specialized Services
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explore our comprehensive range of mental health and wellness
            services
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className="group overflow-hidden border-0 bg-primary/10 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <Link href={`/service-details/${service.slug}`}>
                  <Image
                    src={service.image}
                    alt={`${service.name} - Professional Mental Health Service`}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    fill
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Banner Badge */}
                  <div className="absolute left-4 top-4">
                    <Badge className="rounded-full bg-primary/90 text-white shadow-lg backdrop-blur-sm">
                      {service.bannerText}
                    </Badge>
                  </div>

                  {/* Service Number */}
                  <div className="absolute right-4 top-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 font-bold text-primary shadow-lg backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Floating Action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <Button
                      size="sm"
                      className="rounded-full bg-white/90 px-6 py-2 text-primary shadow-lg hover:bg-white"
                      asChild
                    >
                      <Link
                        href={`/service-details/${service.slug}`}
                        className="flex items-center gap-2"
                      >
                        <span className="font-medium">Learn More</span>
                        <ArrowRight size={14} />
                      </Link>
                    </Button>
                  </div>
                </Link>
              </div>

              {/* Content Section */}
              <CardContent className="space-y-4 p-6">
                <div className="space-y-3">
                  <Link href={`/service-details/${service.slug}`}>
                    <h3 className="text-xl font-bold leading-tight transition-colors duration-300 group-hover:text-primary md:text-2xl">
                      {service.name}
                    </h3>
                  </Link>

                  {/* Service Features */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>Flexible Duration</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      <span>Expert Care</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle size={12} />
                      <span>Evidence-Based</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground">
                      (4.9)
                    </span>
                  </div>

                  {/* Overview */}
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {service.overview}
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  asChild
                  className="w-full rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <Link
                    href={`/service-details/${service.slug}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <BookOpen size={16} />
                    <span className="font-medium">Read More & Learn</span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/10">
        <CardContent className="space-y-6 p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold md:text-3xl">
              Ready to Begin Your Healing Journey?
            </h3>
            <p className="mx-auto max-w-3xl text-muted-foreground">
              Take the first step toward better mental health. Our compassionate
              team is here to support you with evidence-based care tailored to
              your unique needs and circumstances.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-gradient-to-r from-primary to-primary/70 px-8 hover:from-primary/80 hover:to-primary/60"
            >
              <Link
                href="/dashboard/appointments"
                className="flex items-center gap-2"
              >
                <Calendar size={20} />
                Book an Appointment
                <ArrowRight size={16} />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Link href="/contact" className="flex items-center gap-2">
                <Heart size={20} />
                Contact Us Today
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 text-center md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">
                Crisis Support Available
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">
                Lives Transformed
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">20+</div>
              <div className="text-sm text-muted-foreground">
                Years of Experience
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Services;
