import { ArrowRight, Heart, Shield, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

function Hero() {
  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-linear-to-br from-primary to-primary/50">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <Image
          src="https://35jq5szehk.ufs.sh/f/tNU9RDFz3KoO9rwjjnXlKG4t5u3xDPbjmCwOpR8QUX7yFhgN"
          alt="Mental health support and recovery journey - EZZ Freedom and Hope"
          className="object-cover opacity-30"
          fill
          priority
        />
        {/* Subtle Theme Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-linear-to-r from-primary/60 via-primary/40" /> */}
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex min-h-[65vh] items-center">
          {/* Content Container */}
          <div className="max-w-2xl space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-4 py-2 backdrop-blur-xs">
              <Shield className="text-white" size={16} />
              <span className="text-sm font-medium text-white">
                Trusted Mental Health Care
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="fill-yellow-300 text-yellow-300"
                  />
                ))}
              </div>
            </div>

            {/* Main Headlines */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-3xl lg:text-5xl">
                <span className="block">Transform</span>
                <span>Your Life </span>
                <span className="bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Find Hope
                </span>
              </h1>

              <p className="max-w-xl text-xl leading-relaxed text-white/95">
                Professional mental health support and addiction recovery
                services. Take the first step towards healing and lasting
                change.
              </p>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button
                size="lg"
                asChild
                className="group rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/95 hover:shadow-2xl"
              >
                <Link href="/contact" className="flex items-center gap-3">
                  <Heart
                    className="transition-transform group-hover:scale-110"
                    size={20}
                  />
                  <span>Get Help Today</span>
                  <ArrowRight
                    className="transition-transform group-hover:translate-x-1"
                    size={20}
                  />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="group rounded-full border-2 border-white/50 bg-white/15 px-8 py-4 text-lg font-semibold text-white backdrop-blur-xs transition-all duration-300 hover:border-white/70 hover:bg-white/25"
              >
                <Link href="/services" className="flex items-center gap-3">
                  <span>Our Services</span>
                  <ArrowRight
                    className="transition-transform group-hover:translate-x-1"
                    size={16}
                  />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
