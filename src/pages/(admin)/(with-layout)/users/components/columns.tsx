import type { ColumnDef } from "@tanstack/react-table"

import type { IUser } from "@/schema/user"

import { DataTableColumnHeader } from "../../message/components/data-table-column-header"

export const today = new Date().toLocaleDateString("zh-CN")

export const columns: ColumnDef<IUser>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => row.getValue("id"),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "name",
    accessorKey: "name",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="用户" className="text-nowrap text-center" />
    ),
  },
  // {
  //   accessorKey: "room_id",
  //   enableSorting: false,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="群" />
  //   ),
  //   cell: ({ row }) => <Badge className={`${row.getValue("status") === "Deleted" ? "text-slate-400 line-through" : ""}`} variant={row.getValue("status") === "Deleted" ? "outline" : "default"}>{row.getValue("room_id")}</Badge>,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: "sender",
  //   enableSorting: false,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="发送" />
  //   ),
  //   cell: ({ row }) => <Badge className={`${row.getValue("status") === "Deleted" ? "text-slate-400 line-through" : ""}`} variant={row.getValue("status") === "Deleted" ? "outline" : "secondary"}>{row.getValue("sender")}</Badge>,
  //   enableHiding: false,
  // },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="操作" className="text-center" />
    ),
    enableHiding: false,
  },
]
