import Image from "next/image";
import React from "react";
import image from "./../../assets/login-image.jpg";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <div className="h-[80vh] relative before:content-[''] before:absolute before:top-0 before: left-0 before:w-full before:h-full before:z-10 md:before:bg-gradient-to-r from-primary  to-transparent before:rounded-lg md:before:opacity-90 before:bg-primary/50  md:before:bg-transparent">
      <Image
        src={image}
        alt="ezzy hero image"
        className="object-cover rounded-lg"
        fill
      />
      <div className="absolute top-[30%] left-0 lg:w-[60%] h-full rounded-lg z-20 p-1 md:p-10 space-y-7">
        <p className=" text-white lg:text-4xl md:text-4xl text-3xl font-semibold capitalize">
          Breaking the chains of self, Finding purpose
        </p>
        <p className="text-white text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, ipsum.
        </p>
        <Button
          className="rounded-full bg-secondaryColor hover:bg-secondaryColor text-background"
          asChild
        >
          <Link href={"/about-us"}>
            Learn More <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default Hero;
