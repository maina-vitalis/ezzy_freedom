import React from "react";
import ProductCard from "../ProductCard";
import prisma from "@/lib/prisma";
import Image from "next/image";
import empty from "./../../assets/empty.png";

async function Products() {
  const books = await prisma.books.findMany();

  if (!books || books.length === 0) {
    return (
      <div className="h-36 w-full">
        <h2 className="text-lg font-semibold md:text-2xl">
          Therapeutic Reads: Transform Your Mind
        </h2>
        <div className="mt-5 flex flex-col items-center">
          <Image src={empty} alt="empty image" height={70} width={70} />
          <p className="mt-5 text-lg">No Books at the moment come back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">
        Therapeutic Reads: Transform Your Mind
      </h2>

      <div className="flex flex-col justify-between gap-5 md:flex-row">
        {books.map((book, index) => (
          <ProductCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
}

export default Products;
