import { createColumnHelper } from "@tanstack/react-table";
import { ActionsDropdown } from "./rowActions";

type Article = {
  id: string;
  title: string;
  publishMonth: string;
  price: string;
};

const columnHelper = createColumnHelper<Article>();

export const articleColumns = [
  columnHelper.accessor("title", {
    id: "name",
    header: "Article Name",
  }),

  columnHelper.accessor("publishMonth", {
    id: "publishMonth",
    header: "Published Month",
  }),

  columnHelper.accessor("price", {
    id: "price",
    header: "price",
  }),

  {
    id: "actions",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: (props: any) => {
      return <ActionsDropdown id={props.row.original.id} />;
    },
  },
];
