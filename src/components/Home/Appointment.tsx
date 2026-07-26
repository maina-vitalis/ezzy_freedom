import { ArrowRight, Calendar, Heart, Shield, Star, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

function Appointment() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Calendar className="text-primary" size={28} />
          <span className="text-sm font-medium uppercase tracking-wide text-primary">
            Professional Support
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Your Path to Hope & Healing
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Begin your journey toward healing, clarity, and inner peace with our
          professional counseling services.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Left Side - Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold md:text-3xl">
              Take the First Step Today
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              Life&apos;s challenges can feel overwhelming, but you don&apos;t
              have to face them alone. Take a step toward self-discovery,
              resilience, and emotional well-being. Our sessions provide a safe
              space to explore your thoughts, heal from within, and rediscover
              your purpose.
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Shield className="text-primary" size={16} />
              </div>
              <span className="text-sm font-medium">
                Safe & confidential environment
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <User className="text-primary" size={16} />
              </div>
              <span className="text-sm font-medium">
                Licensed professional counselors
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Heart className="text-primary" size={16} />
              </div>
              <span className="text-sm font-medium">
                Personalized treatment plans
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-xs text-muted-foreground">
                Lives Transformed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">20+</div>
              <div className="text-xs text-muted-foreground">
                Years Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.9</div>
              <div className="text-xs text-muted-foreground">Client Rating</div>
            </div>
          </div>
        </div>

        {/* Right Side - CTA Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/10 p-8 shadow-xl">
          <CardContent className="space-y-6 p-0 text-center">
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="text-primary" size={32} />
              </div>

              <h3 className="text-xl font-bold">Ready to Begin?</h3>
              <p className="text-sm text-muted-foreground">
                Schedule your consultation today and take the first step toward
                a healthier, more fulfilling life.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
                <span className="ml-2 text-xs text-muted-foreground">
                  Trusted by 500+ clients
                </span>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full transform rounded-full bg-gradient-to-r from-primary to-primary/70 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/80 hover:to-primary/60 hover:shadow-xl"
              >
                <Link
                  href="/users/dashboard/appointments"
                  className="flex items-center justify-center gap-2"
                >
                  <Calendar size={20} />
                  <span className="font-semibold">Book Your Appointment</span>
                  <ArrowRight size={16} />
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground">
                Free consultation • Flexible scheduling • Insurance accepted
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/10 p-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <h4 className="mb-1 font-semibold text-foreground">
              Need immediate support?
            </h4>
            <p className="text-sm text-muted-foreground">
              Our crisis support team is available 24/7 for urgent mental health
              needs
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="rounded-full border-primary text-primary transition-all duration-300 hover:bg-primary hover:text-white"
          >
            <Link href="/contact" className="flex items-center gap-2">
              Contact Now
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Appointment;
