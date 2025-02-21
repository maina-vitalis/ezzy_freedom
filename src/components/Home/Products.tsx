import React from "react";
import ProductCard from "../ProductCard";
import prisma from "@/lib/prisma";

async function Products() {
  const books = await prisma.books.findMany();
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold">
        Therapeutic Reads: Transform Your Mind
      </h2>

      <div className="flex flex-col md:flex-row gap-5 justify-between">
        {books.map((book, index) => (
          <ProductCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
}

export default Products;
