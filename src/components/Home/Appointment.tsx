import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

function Appointment() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-1 flex-col justify-between gap-5">
        <p className="text-xl font-semibold md:text-5xl">Your Path to Hope</p>
        <p className="text-sm font-semibold text-primary">
          Begin your journey toward healing, clarity, and inner peace.
        </p>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3">
        <p className="text-sm lg:w-[70%]">
          Life&apos;s challenges can feel overwhelming, but you don&apos;t have
          to face them alone. Take a step toward self-discovery, resilience, and
          emotional well-being. Our sessions provide a safe space to explore
          your thoughts, heal from within, and rediscover your purpose.
        </p>

        <Button
          asChild
          variant={"outline"}
          className="w-fit rounded-full bg-card text-foreground transition-all duration-300 ease-in-out hover:scale-105"
        >
          <Link href="/contact">Book Appointment</Link>
        </Button>
      </div>
    </div>
  );
}

export default Appointment;
