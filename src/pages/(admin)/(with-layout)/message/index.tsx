import type { ColumnDef, ColumnFiltersState, ExpandedState, PaginationState } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import * as React from "react"

import { Icons } from "@/components/icons"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMessages } from "@/hooks/query/use-message"
import { i18n } from "@/i18n"
import type { Order } from "@/schema/message"

import { columns } from "./components/columns"
import { DataTableColumnHeader } from "./components/data-table-column-header"
import { DataTablePagination } from "./components/data-table-pagination"
import { DataTableToolbar } from "./components/data-table-toolbar"
import { OrderTable } from "./components/order-table"

export function Component() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [expanded, setExpanded] = React.useState<ExpandedState>(true)

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(() =>
    [{
      id: "day",
      value: new Date(),
    }],
  )
  const { data: messages, isPending, isLoading } = useMessages(pagination, format(columnFilters.find((f) => f.id === "day")?.value as Date, "yyyy-MM-dd"))

  const table = useReactTable({
    data: messages.list ?? [],
    columns,
    pageCount: messages.total_pages ?? -1,
    state: {
      pagination,
      expanded,
      columnFilters,
    },
    onExpandedChange: setExpanded,
    getRowCanExpand: (row) => !!row.original.orders?.length,
    // getSubRows: (row) => row.orders,
    getExpandedRowModel: getExpandedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    // debugTable: true,
    debugAll: true,
  })

  return (
    <div>
      <div className="relative">
        <DataTableToolbar table={table} />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ?
                        null :
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && row.getCanExpand() && (
                      <tr>
                        <td colSpan={row.getVisibleCells().length}>
                          <OrderTable columns={order_columns} data={row.original.orders} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
        {(isPending || isLoading) && (
          <div className="absolute left-0 top-0 flex size-full items-center justify-center text-sm  text-primary-foreground backdrop-blur-sm backdrop-brightness-50">
            <div className="flex items-center justify-center">
              <Icons.spinner className="mr-2 size-4 animate-spin" />
              <span>Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const order_columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => row.getValue("id"),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "lotto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:lotto")} />
    ),
    cell: ({ row }) => row.getValue("lotto"),
  },
  {
    accessorKey: "day",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:day")} />
    ),
    cell: ({ row }) => row.getValue("day"),
    enableSorting: false,
  },
  {
    accessorKey: "method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:method")} />
    ),
    cell: ({ row }) => row.getValue("method"),
  },
  {
    accessorKey: "content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:numbers")} />
    ),
    cell: ({ row }) => row.getValue("content"),
  },
  {
    accessorKey: "times",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:times")} />
    ),
    cell: ({ row }) => ` x ${row.getValue("times")}`,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:price")} />
    ),
    cell: ({ row }) => ` = ${row.getValue("price")}`,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:created_at")} />
    ),
    cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", weekday: undefined, hour: "2-digit", hour12: false, minute: "2-digit", second: "2-digit" }),
  },
]
