import type { ColumnDef } from "@tanstack/react-table"
import { ChevronRight, GalleryVerticalEnd } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CURRENCY_FORMAT } from "@/constants"
import type { Message } from "@/schema/message"

import { statusList } from ".."
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Message>[] = [
  {
    id: "select",
    header: ({ table }) => table.getRowCount() > 0 && table.getCanSomeRowsExpand() && (
      <Button data-state={table.getIsAllRowsExpanded() ? "open" : "closed"} className="flex aspect-square items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground data-[state=open]:rotate-90 after:md:hidden [&>svg]:size-4 [&>svg]:shrink-0" variant="link" size="icon" onClick={table.getToggleAllRowsExpandedHandler()}>
        <ChevronRight />
        <span className="sr-only">Toggle</span>
      </Button>
    ),
    cell: ({ row }) => row.getCanExpand() && (
      <Button data-state={row.getIsExpanded() ? "open" : "closed"} className="flex aspect-square items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform after:absolute after:-inset-2 hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground data-[state=open]:rotate-90 after:md:hidden [&>svg]:size-4 [&>svg]:shrink-0" variant="link" size="icon" onClick={row.getToggleExpandedHandler()}>
        <ChevronRight />
        <span className="sr-only">Toggle</span>
      </Button>
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
    id: "user_id",
    accessorKey: "user_id",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="text-nowrap text-center" title="用户" />
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
    accessorKey: "content",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="内容" className="text-nowrap" />
    ),
    cell: ({ row }) => (
      <div className="flex items-start space-x-2">
        <div className="whitespace-pre-wrap break-all">{row.getValue("content")}</div>
        {row.original.version > 1 && !["Deleted", "Revoked"].includes(row.original.status) && <GalleryVerticalEnd className="size-4 text-blue-500" strokeWidth={2} />}
      </div>
    ),
    enableHiding: false,
  },
  {
    id: "amount",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader className="text-right" column={column} title="金额" />
    ),
    cell: ({ row }) => row.original.orders.length > 0 && <div className="text-right font-semibold text-blue-500">{CURRENCY_FORMAT.format(row.original.orders?.reduce((acc, { price }) => acc + price, 0))}</div>,
    enableHiding: false,
  },
  {
    id: "ts",
    accessorKey: "ts",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="时间" />
    ),
    enableHiding: false,
  },
  {
    id: "status",
    accessorKey: "status",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="状态" className="text-nowrap text-center" />
    ),
    cell: ({ row }) => {
      return statusList.filter((status) => status.value === row.getValue("status")).map((s) => (
        <s.icon key={s.value} />
      ))
    },
    enableHiding: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="操作" className="text-center" />
    ),
    enableHiding: false,
    cell: DataTableRowActions,
  },
]
