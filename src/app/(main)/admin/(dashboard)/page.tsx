"use client";
import React from "react";
import BooksDataTable from "./(book)/BookTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { column } from "./(book)/columns";
import ServiceTable from "./(service)/ServiceTable";
import { serviceColumns } from "./(service)/columns";
import ArticlesDataTable from "./(article)/Articletable";
import { articleColumns } from "./(article)/columns";

//func to fetch the book
const getBooks = async () => {
  const response = await axios.get("/api/books");
  return response.data;
};

const getService = async () => {
  const response = await axios.get("/api/services");
  return response.data;
};

const getArticles = async () => {
  const response = await axios.get("/api/articles");
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

  const { data: articlesData, isLoading: articlesLoader } = useQuery({
    queryKey: ["getting-articles"],
    queryFn: getArticles,
  });

  if (booksLoader || servicesLoader || articlesLoader) {
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

      <div>
        <h2 className="mb-1 text-center text-sm font-semibold text-primary md:text-base">
          Articles Data
        </h2>
        <ArticlesDataTable data={articlesData} columns={articleColumns} />
      </div>
    </div>
  );
}

export default DashBoard;
