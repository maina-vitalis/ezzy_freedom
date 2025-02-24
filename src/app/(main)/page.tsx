import Appointment from "@/components/Home/Appointment";
import ChooseUs from "@/components/Home/ChooseUs";
import Hero from "@/components/Home/Hero";
import Products from "@/components/Home/Products";
import Services from "@/components/Home/Services";
import React from "react";

function Home() {
  return (
    <div className="space-y-20">
      <Hero />
      <Products />
      <Appointment />
      <Services />
      <ChooseUs />
    </div>
  );
}

export default Home;
