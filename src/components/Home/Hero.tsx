import Image from "next/image";
import React from "react";
import image from "./../../assets/login-image.jpg";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function Hero() {
  return (
    <div className="h-[80vh] relative before:content-[''] before:absolute before:top-0 before: left-0 before:w-full before:h-full before:z-10 md:before:bg-gradient-to-r from-primary  to-transparent before:rounded-lg md:before:opacity-90 before:bg-primary/50  md:before:bg-transparent">
      <Image
        src={image}
        alt="ezzy hero image"
        className="object-cover rounded-lg"
        fill
      />
      <div className="absolute top-[30%] left-0 lg:w-[60%] h-full rounded-lg z-20 p-1 md:p-10 space-y-7 flex flex-col items-center md:items-start">
        <p className=" text-white lg:text-4xl md:text-4xl text-2xl text-center md:text-start font-semibold capitalize">
          Breaking the chains of self, Finding purpose
        </p>
        <p className="text-white text-sm text-center md:text-start">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, ipsum.
        </p>
        <Button
          asChild
          variant={"link"}
          className="rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-white flex items-center gap-2 hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-md"
        >
          <Link href={"/about-us"} className="text-white w-fit">
            Learn More
            <ArrowRight className="text-white" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default Hero;
