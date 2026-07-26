import { createColumnHelper } from "@tanstack/react-table";
import { ServiceActionsDropdown } from "./ServiceRowActions";

interface Service {
  name: string;
  bannerText: string;
  overview: string;
}

const columnHelper = createColumnHelper<Service>();

export const serviceColumns = [
  columnHelper.accessor("name", {
    id: "name",
    header: "Service name",
  }),

  columnHelper.accessor("bannerText", {
    id: "bannerText",
    header: "Banner Text",
  }),

  columnHelper.accessor("overview", {
    id: "overview",
    header: "Service Overview",
  }),
  {
    id: "actions",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: (props: any) => {
      return <ServiceActionsDropdown id={props.row.original.id} />;
    },
  },
];
