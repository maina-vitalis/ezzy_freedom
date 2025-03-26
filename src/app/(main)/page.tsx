import Appointment from "@/components/Home/Appointment";
import Articles from "@/components/Home/Articles";
import ChooseUs from "@/components/Home/ChooseUs";
import Hero from "@/components/Home/Hero";
import Products from "@/components/Home/Products";
import Services from "@/components/Home/Services";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

function Home() {
  return (
    <div className="space-y-20">
      <Hero />
      <Products />
      <Articles />
      <Appointment />
      <Services />
      <ChooseUs />
      <div className="mt-5 flex flex-col gap-4 rounded-lg bg-primary p-5">
        <p className="text-center">
          Ready to start your recovery journey? Join our supportive community
          and get help when you need it. Connect with others by joining our
          WhatsApp recovery group!
        </p>
        <Button className="mx-auto flex max-w-full items-center gap-4 rounded-full border-[1px] border-transparent bg-green-500 text-black transition-all duration-300 ease-in-out hover:border-white hover:bg-transparent hover:text-white md:max-w-[50%]">
          <a
            href="https://chat.whatsapp.com/LguO5OsS1FiGZ7K2iYV6gs"
            target="_blank"
            rel="noopener"
          >
            Join Recovery Support Group
          </a>
          <FaWhatsapp className="text-2xl" />
        </Button>
      </div>
    </div>
  );
}

export default Home;
