import { createColumnHelper } from "@tanstack/react-table";
import { ActionsDropdown } from "./RowActions";

type Book = {
  title: string;
  price: string;
  targetAudience: string;
};

const columnHelper = createColumnHelper<Book>();

export const column = [
  columnHelper.accessor("title", {
    id: "title",
    header: "Book name",
  }),

  columnHelper.accessor("targetAudience", {
    id: "targetAudience",
    header: "Audience",
  }),

  columnHelper.accessor("price", {
    id: "price",
    header: "Price",
    cell: (info) => info.getValue(),
  }),

  {
    id: "actions",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: (props: any) => {
      return <ActionsDropdown id={props.row.original.id} />;
    },
  },
];
