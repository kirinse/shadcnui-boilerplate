import type { ColumnDef } from "@tanstack/react-table"
import { ChevronRight, CircleCheck, CircleX, Hourglass, Trash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Message } from "@/schema/message"

import { DataTableColumnHeader } from "./data-table-column-header"

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
      <Button data-state={row.getIsExpanded() ? "open" : "closed"} className="flex aspect-square items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground data-[state=open]:rotate-90 after:md:hidden [&>svg]:size-4 [&>svg]:shrink-0" variant="link" size="icon" onClick={row.getToggleExpandedHandler()}>
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
    accessorKey: "room_id",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="群" />
    ),
    cell: ({ row }) => <Badge className={`${row.getValue("status") === "Deleted" ? "text-slate-400 line-through" : ""}`} variant={row.getValue("status") === "Deleted" ? "outline" : "default"}>{row.getValue("room_id")}</Badge>,
    enableHiding: false,
  },
  {
    accessorKey: "sender",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="发送" />
    ),
    cell: ({ row }) => <Badge className={`${row.getValue("status") === "Deleted" ? "text-slate-400 line-through" : ""}`} variant={row.getValue("status") === "Deleted" ? "outline" : "secondary"}>{row.getValue("sender")}</Badge>,
    enableHiding: false,
  },
  {
    accessorKey: "content",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="内容" className="text-nowrap" />
    ),
    cell: ({ row }) => <div className="flex items-center whitespace-pre-wrap break-all">{row.getValue("content")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "ts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="时间" />
    ),
    cell: ({ row }) => <span className="text-nowrap">{new Date((row.getValue("ts") as number) * 1000).toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", weekday: undefined, hour: "2-digit", hour12: false, minute: "2-digit", second: "2-digit" })}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="状态" />
    ),
    cell: ({ row }) => {
      switch (row.getValue("status")) {
        case "Deleted": {
          return (<Trash size={16} className="text-slate-400" />)
        }
        case "Finished": {
          return (<CircleCheck size={16} className="text-green-500" />)
        }
        case "Failed": {
          return (<CircleX size={16} className="text-red-500" />)
        }
        default: {
          return (<Hourglass size={16} xlinkTitle="等待" className="text-orange-500" />)
        }
      }
    },
    enableHiding: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="操作" className="text-center" />
    ),
    enableHiding: false,
  },
]
