"use client";

import {
  Award,
  Clock,
  HandHeart,
  Heart,
  Lightbulb,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

// ─── Data ──────────────────────────────────────────────────────────────────────

const reasons = [
  {
    icon: Award,
    title: "Expert-Led Support",
    description:
      "Founded by a licensed mental health expert and recovering addict with 20+ years of experience, ensuring evidence-based and compassionate care.",
    badge: "20+ Years Experience",
  },
  {
    icon: Shield,
    title: "Long-Term Recovery",
    description:
      "We provide aftercare programs, mentorship, and reintegration support to prevent relapse and promote lasting, sustainable recovery.",
    badge: "Aftercare Programs",
  },
  {
    icon: Lightbulb,
    title: "Community Education",
    description:
      "Through workshops and outreach we combat stigma, educate communities, and encourage open conversations about mental health.",
    badge: "Community Impact",
  },
  {
    icon: Heart,
    title: "Holistic Wellness",
    description:
      "Beyond addiction we address stress, workplace health, teenage identity, and relationship counselling — the full human experience.",
    badge: "Comprehensive Care",
  },
  {
    icon: Clock,
    title: "24/7 Crisis Support",
    description:
      "Round-the-clock crisis assistance and emergency support lines so help is always available exactly when it matters most.",
    badge: "Always Available",
  },
  {
    icon: Users,
    title: "Peer Community",
    description:
      "A thriving recovery community with peer support groups, shared lived experience, and ongoing guidance from people who truly understand.",
    badge: "You're Not Alone",
  },
];

const stats = [
  { number: 500, suffix: "+", label: "Lives Transformed" },
  { number: 20, suffix: "+", label: "Years of Service" },
  { number: 100, suffix: "+", label: "Workshops Held" },
  { number: 98, suffix: "%", label: "Client Satisfaction" },
];

// ─── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  number,
  suffix,
  label,
  trigger,
}: {
  number: number;
  suffix: string;
  label: string;
  trigger: boolean;
}) {
  const count = useCountUp(number, 1600, trigger);
  return (
    <div className="group flex flex-col items-center gap-1 rounded-2xl border border-primary/20 bg-card px-6 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <span className="text-4xl font-extrabold tabular-nums text-primary">
        {count}
        {suffix}
      </span>
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
function ChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Trigger stat counters when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="space-y-14">
      {/* ── Header ── */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <HandHeart size={26} />
          <span className="text-sm font-semibold uppercase tracking-widest">
            Our Promise
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
          Why Choose{" "}
          <span className="text-primary">EZZ Freedom</span>{" "}
          and Hope?
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Our unique approach combines professional expertise with lived
          experience — creating trust, understanding, and lasting change.
        </p>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} trigger={statsVisible} />
        ))}
      </div>

      {/* ── Reason Cards ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
          >
            {/* Subtle teal glow strip at top */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <CardContent className="space-y-4 p-6">
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                <reason.icon className="text-primary" size={22} />
              </div>

              {/* Title + Badge */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {reason.title}
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-xs font-medium text-primary"
                >
                  {reason.badge}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {reason.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Bottom CTA Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-10 text-center text-primary-foreground shadow-xl">
        {/* Decorative rings */}
        <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative space-y-3">
          <div className="flex items-center justify-center gap-2 opacity-80">
            <Target size={18} />
            <span className="text-sm font-semibold uppercase tracking-widest">
              Our Commitment
            </span>
          </div>
          <h3 className="text-2xl font-bold md:text-3xl">
            Licensed · Certified · Proven
          </h3>
          <p className="mx-auto max-w-xl text-sm opacity-80 md:text-base">
            Delivering exceptional mental health care with compassion, expertise,
            and outcomes that speak for themselves.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChooseUs;
