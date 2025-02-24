"use client";
import React from "react";
import BooksDataTable from "./(book)/BookTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { column } from "./(book)/columns";
import ServiceTable from "./(service)/ServiceTable";
import { serviceColumns } from "./(service)/columns";

//func to fetch the book
const getBooks = async () => {
  const response = await axios.get("/api/books");
  console.log(response);
  return response.data;
};

const getService = async () => {
  const response = await axios.get("/api/services");
  console.log(response);
  return response.data;
};

function DashBoard() {
  const { data: booksData, isLoading: booksLoader } = useQuery({
    queryKey: ["getting-books"],
    queryFn: getBooks,
  });

  const { data: servicesData, isLoading: servicesLoader } = useQuery({
    queryKey: ["getting-services"],
    queryFn: getService,
  });

  if (booksLoader || servicesLoader) {
    return (
      <p className="flex items-center justify-center text-center">
        <Loader2 className="animate-spin" size={30} />
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-1 text-center text-sm font-semibold text-primary md:text-base">
          Books Data
        </h2>
        <BooksDataTable data={booksData} columns={column} />
      </div>
      <div>
        <h2 className="mb-1 text-center text-sm font-semibold text-primary md:text-base">
          Services Data
        </h2>
        <ServiceTable data={servicesData} columns={serviceColumns} />
      </div>
    </div>
  );
}

export default DashBoard;
