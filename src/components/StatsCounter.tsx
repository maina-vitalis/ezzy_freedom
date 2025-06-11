"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface StatItem {
  number: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface StatsCounterProps {
  stats: StatItem[];
}

export default function StatsCounter({ stats }: StatsCounterProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (inView) {
      setHasScrolled(true);
    }
  }, [inView]);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {hasScrolled &&
        stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
              {stat.prefix}
              <CountUp end={stat.number} duration={2.5} delay={index * 0.2} />
              {stat.suffix}
            </div>
            <p className="text-sm font-medium text-muted-foreground md:text-base">
              {stat.label}
            </p>
          </div>
        ))}
    </div>
  );
}
