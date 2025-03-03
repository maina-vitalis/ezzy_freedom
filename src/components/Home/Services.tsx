import React from "react";
import SessionComponent from "../SessionComponent";
import prisma from "@/lib/prisma";

async function Services() {
  const services = await prisma.service.findMany();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Our services </h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-5">
        {services.map((item) => (
          <SessionComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Services;
