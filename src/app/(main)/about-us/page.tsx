import ReachOut from "@/components/forms/ReachOut";
import StatsCounter from "@/components/StatsCounter";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Check,
  Globe,
  Heart,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import ezra from "./../../../assets/ezzy.png";

export const metadata: Metadata = {
  title:
    "About EZZ Freedom and Hope - Mental Health & Addiction Recovery Foundation",
  description:
    "Learn about EZZ Freedom and Hope Foundation, our mission to provide mental health awareness, addiction recovery support, and hope to individuals and communities. Founded by Clr. Ezra Karanja, a licensed addiction counselor and recovery advocate.",
  keywords:
    "mental health foundation, addiction recovery, addiction counseling, mental health awareness, Kenya, Ezra Karanja, substance abuse recovery, therapy services, counseling services",
  openGraph: {
    title: "About EZZ Freedom and Hope Foundation",
    description:
      "Empowering lives through mental health awareness and addiction recovery support. Learn about our founder's journey and mission.",
    url: "https://ezzfreedomandhope.or.ke/about-us",
    type: "website",
    images: [
      {
        url: "https://ezzfreedomandhope.or.ke/assets/about-hero.jpg",
        width: 1200,
        height: 630,
        alt: "EZZ Freedom and Hope Foundation - About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About EZZ Freedom and Hope Foundation",
    description:
      "Empowering lives through mental health awareness and addiction recovery support.",
    images: ["https://ezzfreedomandhope.or.ke/assets/about-hero.jpg"],
  },
  alternates: {
    canonical: "https://ezzfreedomandhope.or.ke/about-us",
  },
};

const stats = [
  { number: 20, label: "Years Experience", suffix: "+" },
  { number: 100, label: "Workshops & Seminars", suffix: "+" },
  { number: 500, label: "Lives Transformed", suffix: "+" },
  { number: 10, label: "Community Programs", suffix: "+" },
];

const coreValues = [
  {
    icon: Heart,
    title: "Compassion",
    description:
      "We approach every individual with empathy and understanding, recognizing that healing begins with compassionate care.",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Creating safe spaces where individuals feel secure to share their struggles and begin their recovery journey.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Building strong support networks that foster connection, belonging, and mutual encouragement in recovery.",
  },
  {
    icon: Target,
    title: "Purpose-Driven",
    description:
      "Every action we take is guided by our commitment to meaningful impact in mental health and addiction recovery.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for the highest standards in our services, ensuring quality care and evidence-based practices.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description:
      "Making mental health support accessible to all, regardless of economic status or geographical location.",
  },
];

const achievements = [
  "Licensed addiction counselor with specialized training in substance abuse recovery",
  "Over 20 years of experience in mental health advocacy and community support",
  "Established recovery support groups across multiple communities",
  "Conducted 100+ workshops on mental health awareness and addiction prevention",
  "Mentored hundreds of individuals through their recovery journey",
  "Recognized advocate for breaking mental health stigma in Kenya",
];

function AboutUs() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "EZZ Freedom and Hope Foundation",
            description:
              "Mental health awareness initiative and addiction recovery support foundation",
            url: "https://ezzfreedomandhope.or.ke",
            logo: "https://ezzfreedomandhope.or.ke/assets/logo.png",
            founder: {
              "@type": "Person",
              name: "Ezra Karanja",
              jobTitle: "Licensed Addiction Counselor",
              description:
                "Founder of EZZ Freedom and Hope Foundation, recovering addict, and mental health advocate",
            },
            address: {
              "@type": "PostalAddress",
              addressCountry: "Kenya",
            },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              url: "https://ezzfreedomandhope.or.ke/contact",
            },
            sameAs: ["https://chat.whatsapp.com/LguO5OsS1FiGZ7K2iYV6gs"],
          }),
        }}
      />

      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative left-0 h-[40vh] overflow-hidden rounded-xl md:h-[50vh]">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
            <Image
              src="https://35jq5szehk.ufs.sh/f/tNU9RDFz3KoO9G1xO3rXlKG4t5u3xDPbjmCwOpR8QUX7yFhg"
              alt="EZZ Freedom and Hope Foundation - Mental Health Support"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-white">
              <div className="mx-auto max-w-4xl px-4 text-center">
                <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                  Empowering Lives,{" "}
                  <span className="text-yellow-300">Restoring Hope</span>
                </h1>
                <p className="mx-auto max-w-2xl text-xl font-medium md:text-2xl">
                  Breaking barriers in mental health through compassionate care
                  and community support
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Foundation Overview */}
        <section className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                Who We Are
              </span>
              <h2 className="mb-4 mt-2 text-3xl font-bold md:text-4xl">
                EZZ Freedom and Hope Foundation
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                A dedicated{" "}
                <strong className="text-primary">
                  mental health awareness initiative
                </strong>{" "}
                addressing critical challenges in mental well-being, addiction
                recovery, and social issues.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                Recognizing that{" "}
                <strong className="text-primary">
                  ignorance and assumptions
                </strong>{" "}
                about mental health can be harmful, we strive to equip
                individuals with the right{" "}
                <strong className="text-primary">
                  information, support, and interventions
                </strong>{" "}
                to bridge the gap in awareness and advocacy.
              </p>

              <p className="text-muted-foreground">
                Our approach combines{" "}
                <strong className="text-primary">
                  evidence-based practices
                </strong>{" "}
                with compassionate care, ensuring that everyone who seeks help
                finds the support they need to heal and thrive.
              </p>
            </div>
          </div>

          <div className="relative h-[400px] overflow-hidden rounded-xl shadow-2xl">
            <Image
              src="https://35jq5szehk.ufs.sh/f/tNU9RDFz3KoOUw56pPydJaCcu6rFeWZRAOYGo8y4nEz7iIfK"
              alt="Mental health support and community care"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">Our Impact in Numbers</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Over two decades of dedicated service to mental health awareness
              and addiction recovery
            </p>
          </div>
          <StatsCounter stats={stats} />
        </section>

        {/* Founder Section */}
        <section className="grid items-start gap-12 md:grid-cols-2">
          <div className="relative h-[500px] overflow-hidden rounded-xl shadow-2xl">
            <Image
              src={ezra}
              alt="Clr. Ezra Karanja - Founder of EZZ Freedom and Hope Foundation"
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                Our Founder
              </span>
              <h2 className="mb-4 mt-2 text-3xl font-bold md:text-4xl">
                Clr. Ezra Karanja
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Licensed Addiction Counselor & Mental Health Advocate
              </p>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="leading-relaxed text-muted-foreground">
                Clr. Ezra Karanja, the visionary founder of EZZ Freedom and Hope
                Foundation, brings a unique perspective shaped by personal
                experience and professional expertise. As a{" "}
                <strong className="text-primary">
                  recovering addict turned licensed addiction counselor
                </strong>
                , his journey from struggle to strength embodies the very hope
                he offers to others.
              </p>

              <p className="leading-relaxed text-muted-foreground">
                After{" "}
                <strong className="text-primary">
                  nearly 12 years battling addiction
                </strong>
                , Ezra made the courageous decision to seek help through an
                in-patient rehabilitation program. This transformative
                experience not only saved his life but revealed his calling in
                counseling and advocacy.
              </p>

              <p className="leading-relaxed text-muted-foreground">
                Today, with over{" "}
                <strong className="text-primary">
                  20 years of dedicated service
                </strong>
                , he specializes in addiction recovery and mental health
                advocacy, creating platforms for awareness, support, and
                inspiring others to reclaim their lives.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="mb-4 text-xl font-semibold">Key Achievements</h3>
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 flex-shrink-0 text-primary"
                    size={18}
                  />
                  <p className="text-sm text-muted-foreground">{achievement}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid gap-8 md:grid-cols-2">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
            <CardContent className="space-y-4 p-0">
              <div className="mb-4 flex items-center gap-3">
                <Target className="text-primary" size={28} />
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                To bring{" "}
                <strong className="text-primary">
                  mental health awareness
                </strong>{" "}
                to as many doorsteps as possible through accessible and
                affordable means. We strive to{" "}
                <strong className="text-primary">
                  break the cycle of substance dependence
                </strong>{" "}
                across all ages and social classes, ensuring that recovery is a
                recognized and celebrated journey.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                By reaching individuals{" "}
                <strong className="text-primary">
                  before addiction takes hold
                </strong>
                , we aim to dispel false narratives and foster informed choices
                while sensitizing communities on the crucial link between{" "}
                <strong className="text-primary">
                  mental wellness, productivity, and safety
                </strong>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-8">
            <CardContent className="space-y-4 p-0">
              <div className="mb-4 flex items-center gap-3">
                <Globe className="text-blue-600" size={28} />
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                We envision a future where{" "}
                <strong className="text-blue-600">
                  recovery support groups
                </strong>{" "}
                are established in all sub-counties, providing accessible and
                localized help for those in need.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Additionally, we aim to create a comprehensive{" "}
                <strong className="text-blue-600">digital platform</strong> that
                offers round-the-clock access to mental health support services,
                ensuring help is always within reach for every Kenyan.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Core Values */}
        <section>
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              Our Foundation
            </span>
            <h2 className="mb-4 mt-2 text-3xl font-bold md:text-4xl">
              Core Values
            </h2>
            <p className="mx-auto max-w-3xl text-muted-foreground">
              These principles guide our efforts in mental health advocacy and
              addiction recovery, shaping our commitment to creating a
              supportive environment where individuals can heal, grow, and
              reclaim their lives.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, index) => (
              <Card
                key={index}
                className="p-6 transition-shadow hover:shadow-lg"
              >
                <CardContent className="space-y-4 p-0">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <value.icon className="text-primary" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold">{value.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <ReachOut />
        </section>
      </div>
    </>
  );
}

export default AboutUs;
