import { ColumnDef } from "@tanstack/react-table";
import { ActionsDropdown } from "./rowActions";
import { format } from "date-fns";

type Article = {
  id: string;
  title: string;
  publishDate: Date;
  price: number;
};

export const articleColumns: ColumnDef<Article>[] = [
  {
    accessorKey: "title",
    header: "Article Name",
  },
  {
    accessorKey: "publishDate",
    header: "Published Date",
    cell: ({ row }) => {
      return format(new Date(row.original.publishDate), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return `KES ${row.original.price}`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsDropdown id={row.original.id} />;
    },
  },
];
