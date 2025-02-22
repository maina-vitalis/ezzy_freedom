import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

function Appointment() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 flex-col gap-5 flex justify-between">
        <p className="md:text-5xl text-3xl font-semibold">
          Your Path <br className="hidden md:block" /> to Hope
        </p>
        <p className="text-sm font-semibold text-primary">
          Explore your inner world and gain insights
        </p>
      </div>
      <div className="flex-1 flex flex-col justify-between gap-3">
        <p className="text-sm  lg:w-[70%]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
          temporibus est blanditiis vero nemo cumque, deserunt possimus tempore
          consectetur rerum quas doloremque. Omnis voluptate aperiam eaque nam
          quam provident dignissimos
        </p>

        <Button
          asChild
          variant={"outline"}
          className="rounded-full w-fit bg-card text-foreground hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <Link href="/contact">Book Appointment</Link>
        </Button>
      </div>
    </div>
  );
}

export default Appointment;
