import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function Hero() {
  return (
    <div className="before: relative left-0 h-[80vh] from-primary to-transparent before:absolute before:top-0 before:z-10 before:h-full before:w-full before:rounded-lg before:bg-primary/50 before:content-[''] md:before:bg-transparent md:before:bg-gradient-to-r md:before:opacity-90">
      <Image
        src={
          "https://35jq5szehk.ufs.sh/f/tNU9RDFz3KoO9rwjjnXlKG4t5u3xDPbjmCwOpR8QUX7yFhgN"
        }
        alt="ezzy hero image"
        className="rounded-lg object-cover"
        fill
      />
      <div className="absolute left-[50%] top-[30%] z-20 flex h-full w-full -translate-x-[50%] flex-col items-center space-y-7 rounded-lg p-1 md:left-0 md:translate-x-0 md:items-start md:p-10 lg:w-[60%]">
        <p className="text-center text-2xl font-semibold capitalize text-white md:text-start md:text-4xl">
          Breaking the chains of self, Finding purpose
        </p>
        <p className="text-center text-sm text-white md:text-start">
          True freedom begins when we break free from self-doubt, fear, and
          limitations. Embracing growth, resilience, and purpose leads to a life
          of fulfillment and impact.{" "}
        </p>
        <Button
          asChild
          variant={"link"}
          className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md"
        >
          <Link href={"/about-us"} className="w-fit text-white">
            Learn More
            <ArrowRight className="text-white" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default Hero;
