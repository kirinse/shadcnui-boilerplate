import type { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { CURRENCY_FORMAT } from "@/constants"
import { i18n } from "@/i18n"
import type { Order } from "@/schema/message"

import { DataTableColumnHeader } from "./data-table-column-header"

export const order_columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => row.getValue("id"),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "lotto",
    accessorKey: "lotto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:lotto")} />
    ),
    cell: ({ row }) => row.getValue("lotto"),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "day",
    accessorKey: "day",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:day")} />
    ),
    cell: ({ row }) => row.getValue("day"),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "method",
    accessorKey: "method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:method")} />
    ),
    cell: ({ row }) => row.getValue("method"),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "numbers",
    accessorKey: "numbers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:numbers")} />
    ),
    cell: ({ row }) => (row.getValue("numbers") as string[]).join(", "),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "times",
    accessorKey: "times",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:times")} />
    ),
    cell: ({ row }) => ` x ${row.getValue("times")}`,
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader className="text-nowrap text-right text-sm font-medium" column={column} title={i18n.t("message:price")} />
    ),
    cell: ({ row }) => (<div className="text-right font-semibold text-cyan-500 dark:text-cyan-400">{CURRENCY_FORMAT.format(row.getValue("price"))}</div>),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "prize",
    accessorKey: "prize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:prize")} className="text-right" />
    ),
    cell: ({ row }) => CURRENCY_FORMAT.format(row.getValue("prize")),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:created_at")} />
    ),
    cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString("zh-CN", { year: "numeric", month: "numeric", day: "numeric", weekday: undefined, hour: "2-digit", hour12: false, minute: "2-digit", second: "2-digit" }).replace(new Date().toLocaleDateString("zh-CN"), "").trim(),
    enableHiding: false,
    enableSorting: false,
  },
]
