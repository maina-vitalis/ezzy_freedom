import {
  Award,
  CircleCheck,
  Clock,
  HandHeart,
  Heart,
  Lightbulb,
  Shield,
  Star,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

const reasons = [
  {
    number: "01",
    icon: Award,
    title: "Expert-Led Support",
    description:
      "Founded by a licensed mental health expert and recovering addict with 20+ years of experience, ensuring evidence-based and compassionate care.",
    highlight: "20+ Years Experience",
  },
  {
    number: "02",
    icon: Shield,
    title: "Long-Term Recovery Support",
    description:
      "We provide aftercare programs, mentorship, and reintegration support to prevent relapse and promote lasting recovery.",
    highlight: "Aftercare Programs",
  },
  {
    number: "03",
    icon: Lightbulb,
    title: "Community Awareness & Education",
    description:
      "Through workshops and outreach, we combat stigma, educate communities, and encourage open discussions on mental health.",
    highlight: "Community Impact",
  },
  {
    number: "04",
    icon: Heart,
    title: "Holistic Mental Wellness Approach",
    description:
      "Beyond addiction, we address stress management, workplace mental health, teenage identity crises, and relationship counseling.",
    highlight: "Comprehensive Care",
  },
];

const stats = [
  { number: "500+", label: "Lives Transformed" },
  { number: "20+", label: "Years of Service" },
  { number: "100+", label: "Workshops Conducted" },
  { number: "4.9", label: "Client Rating" },
];

function ChooseUs() {
  return (
    <div className="space-y-16">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <HandHeart className="text-primary" size={28} />
          <span className="text-sm font-medium uppercase tracking-wide text-primary">
            Our Promise
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Why Choose EZZ Freedom and Hope?
        </h2>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Our unique approach combines professional expertise with lived
          experience, creating a foundation of trust and understanding that sets
          us apart.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-12 lg:grid-cols-2 xl:gap-16">
        {/* Left Column - Reasons Grid */}
        <div className="space-y-6">
          <div className="grid gap-5">
            {reasons.map((reason, index) => (
              <Card
                key={index}
                className="group border-0 bg-gradient-to-br from-primary/20 to-primary/5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Number Badge */}
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg">
                        {reason.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <reason.icon className="text-primary" size={18} />
                          <h3 className="text-base font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                            {reason.title}
                          </h3>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-xs text-primary"
                        >
                          {reason.highlight}
                        </Badge>
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {reason.description}
                      </p>

                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className="fill-current" />
                        ))}
                        <span className="ml-1 text-xs text-muted-foreground">
                          Excellence
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column - Image and Stats Section */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Hero Image */}
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="relative h-80">
              <Image
                src="https://35jq5szehk.ufs.sh/f/tNU9RDFz3KoOO4ycmiQrgXbHyN3ps8SaUkdjB2w5AGZLJK46"
                alt="Professional mental health support - EZZ Freedom and Hope Foundation"
                className="object-cover"
                fill
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

              {/* Floating Badge */}
              <div className="absolute left-4 top-4">
                <Badge className="bg-white/90 text-primary shadow-lg backdrop-blur-sm">
                  <CircleCheck size={14} className="mr-1" />
                  Trusted Care
                </Badge>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="mb-2 text-lg font-bold">
                  Compassionate Professional Care
                </h3>
                <p className="text-sm opacity-90">
                  Where expertise meets empathy in mental health support
                </p>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border-0 bg-gradient-to-br from-primary/5 to-blue-500/5 p-4 text-center shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="space-y-1 p-0">
                  <div className="text-2xl font-bold text-primary">
                    {stat.number}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Visual Balance Element */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
            <CardContent className="space-y-4 p-6">
              <div className="text-center">
                <h4 className="text-lg font-bold text-foreground">
                  Our Commitment
                </h4>
                <p className="text-sm text-muted-foreground">
                  Delivering exceptional mental health care with compassion,
                  expertise, and proven results
                </p>
              </div>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">Licensed</div>
                  <div className="text-xs text-muted-foreground">
                    Professionals
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    Certified
                  </div>
                  <div className="text-xs text-muted-foreground">Programs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">Proven</div>
                  <div className="text-xs text-muted-foreground">Methods</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Additional Trust Indicators */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-blue-500/10">
        <CardContent className="p-8">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 hover:bg-primary/20">
                <Clock className="text-primary" size={28} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">24/7 Support</h4>
                <p className="text-sm text-muted-foreground">
                  Round-the-clock crisis support and emergency assistance when
                  you need it most
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 hover:bg-primary/20">
                <Users className="text-primary" size={28} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">Community Support</h4>
                <p className="text-sm text-muted-foreground">
                  Active recovery community with peer support groups and ongoing
                  guidance
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 hover:bg-primary/20">
                <Target className="text-primary" size={28} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">Proven Results</h4>
                <p className="text-sm text-muted-foreground">
                  Evidence-based treatment with measurable outcomes and lasting
                  recovery
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChooseUs;
