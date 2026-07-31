import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { normalizeImageSrc } from "@/lib/image";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  MessageCircle,
  Shield,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type ServiceDetailsProps = Promise<{
  slug: string;
}>;

export async function generateMetadata(props: { params: ServiceDetailsProps }) {
  const { slug } = await props.params;
  const service = await prisma.service.findFirst({
    where: {
      slug,
    },
  });

  if (!service) {
    redirect(notFound());
  }

  return {
    title: `${service.name} - Professional Mental Health Service | EZZ Freedom and Hope`,
    description: service.overview,
    openGraph: {
      title: service.name,
      description: service.overview,
      images: [service.image],
    },
    keywords: [
      "mental health",
      "therapy",
      "counseling",
      service.name,
      "EZZ Freedom and Hope",
    ],
  };
}

async function ServiceDetails(props: { params: ServiceDetailsProps }) {
  const { slug } = await props.params;

  const service = await prisma.service.findFirst({
    where: {
      slug,
    },
  });

  if (!service) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6">
        <div className="space-y-4 text-center">
          <Heart className="text-muted-foreground mx-auto" size={64} />
          <h1 className="text-2xl font-bold text-red-500">Service Not Found</h1>
          <p className="text-muted-foreground">
            The service you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
        <Button className="rounded-full" asChild>
          <Link href="/services">
            <ArrowLeft className="mr-2" size={16} />
            Browse All Services
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-muted-foreground flex items-center space-x-2 text-sm">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/services" className="hover:text-primary">
          Services
        </Link>
        <span>/</span>
        <span className="text-foreground">{service.name}</span>
      </nav>

      {/* Hero Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Service Image */}
        <Card className="overflow-hidden border-0 shadow-2xl">
          <div className="relative h-96">
            <Image
              src={normalizeImageSrc(service.image)}
              alt={`${service.name} - Professional Mental Health Service`}
              className="object-cover"
              fill
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />

            {/* Banner Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary/90 text-white shadow-lg backdrop-blur-xs">
                {service.bannerText}
              </Badge>
            </div>

            {/* Trust Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="text-primary bg-white/90 shadow-lg backdrop-blur-xs">
                <CheckCircle size={14} className="mr-1" />
                Expert Care
              </Badge>
            </div>

            {/* Bottom Content */}
            <div className="absolute right-4 bottom-4 left-4 text-white">
              <h1 className="text-2xl leading-tight font-bold md:text-3xl">
                {service.name}
              </h1>
              <p className="mt-2 text-sm opacity-90">
                Professional mental health and wellness service
              </p>
            </div>
          </div>
        </Card>

        {/* Service Information */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-primary">
                Mental Health Service
              </Badge>
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
                <span className="text-muted-foreground ml-1 text-sm">
                  (4.9 • Expert-Led)
                </span>
              </div>
            </div>

            <h2 className="text-foreground text-xl font-bold md:text-2xl">
              Service Overview
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              {service.overview}
            </p>
          </div>

          {/* Service Features */}
          <Card className="border-primary/20 from-primary/5 to-primary/5 bg-linear-to-br">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-bold">What&apos;s Included</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Professional consultation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Personalized treatment plan</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Follow-up support</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Resource materials</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              size="lg"
              className="from-primary to-primary/70 hover:from-primary/80 hover:to-primary/60 rounded-full bg-linear-to-r text-white shadow-lg"
              asChild
            >
              <Link
                href="/dashboard/appointments"
                className="flex items-center gap-2"
              >
                <Calendar size={20} />
                Book Appointment
                <ArrowRight size={16} />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary rounded-full hover:text-white"
              asChild
            >
              <Link href="/contact" className="flex items-center gap-2">
                <MessageCircle size={20} />
                Ask Questions
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed Service Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary" size={24} />
            <h2 className="text-2xl font-bold">Detailed Information</h2>
          </div>
          <p className="text-muted-foreground">
            Comprehensive details about this mental health service
          </p>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: service.description }}
              className="leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Details Accordion */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold">Service Details</h2>
          <p className="text-muted-foreground">
            Everything you need to know about this service
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-gray-200">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-2">
                  <Clock className="text-primary" size={20} />
                  <span className="font-semibold">Duration & Schedule</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Our sessions are designed to be flexible and accommodate
                    your schedule. Typical sessions last 45-60 minutes, with
                    follow-up appointments scheduled based on your individual
                    needs and treatment plan.
                  </p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-primary" size={16} />
                      <span>45-60 minute sessions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-primary" size={16} />
                      <span>Flexible scheduling</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-gray-200">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-2">
                  <Users className="text-primary" size={20} />
                  <span className="font-semibold">Who Can Benefit</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <p className="text-muted-foreground leading-relaxed">
                  This service is designed for individuals seeking professional
                  mental health support. Whether you&apos;re dealing with
                  stress, anxiety, depression, relationship issues, or simply
                  want to improve your overall well-being, our expert team is
                  here to help.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="text-primary" size={20} />
                  <span className="font-semibold">Our Approach</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <p className="text-muted-foreground leading-relaxed">
                  We employ evidence-based therapeutic approaches tailored to
                  your specific needs. Our treatment methods are grounded in
                  scientific research and delivered with compassion and
                  understanding. Every treatment plan is personalized to ensure
                  the best possible outcomes for your mental health journey.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Bottom CTA Section */}
      <Card className="border-primary/20 from-primary/10 to-primary/10 bg-linear-to-r">
        <CardContent className="space-y-6 p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold md:text-3xl">
              Ready to Start Your Journey?
            </h3>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Take the first step toward better mental health. Our compassionate
              team is here to support you with personalized, evidence-based
              care.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              asChild
              className="from-primary to-primary/70 hover:from-primary/80 hover:to-primary/60 rounded-full bg-linear-to-r"
            >
              <Link
                href="/dashboard/appointments"
                className="flex items-center gap-2"
              >
                <Calendar size={20} />
                Book Your Appointment
                <ArrowRight size={16} />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary text-primary hover:bg-primary rounded-full hover:text-white"
            >
              <Link href="/services">
                <ArrowLeft size={20} className="mr-2" />
                View All Services
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 text-center md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-primary text-xl font-bold">Expert Care</div>
              <div className="text-muted-foreground text-sm">
                20+ Years Experience
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-primary text-xl font-bold">
                Proven Results
              </div>
              <div className="text-muted-foreground text-sm">
                Evidence-Based Treatment
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-primary text-xl font-bold">24/7 Support</div>
              <div className="text-muted-foreground text-sm">
                Always Here for You
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ServiceDetails;
