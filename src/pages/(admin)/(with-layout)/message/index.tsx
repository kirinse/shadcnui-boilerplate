import type { ColumnDef, ColumnFiltersState, ExpandedState, PaginationState } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { t } from "i18next"
import { HistoryIcon, Trash } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { DatePicker } from "@/components/date-picker"
import { Icons } from "@/components/icons"
import { Refresher } from "@/components/refresher"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMessageDeletionMutation, useMessages } from "@/hooks/query/use-message"
import { i18n } from "@/i18n"
import { getFetchErrorMessage } from "@/lib/api-fetch"
import type { Order } from "@/schema/message"

import { columns } from "./components/columns"
import { DataTableColumnHeader } from "./components/data-table-column-header"
import { DataTablePagination } from "./components/data-table-pagination"
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
  const [refetchInterval, setRefetchInterval] = React.useState<number | boolean>(false)

  const filter = columnFilters.find((filters) => filters.id === "day")

  const { data: messages, isFetching, isRefetching, refetch } = useMessages(pagination, format(columnFilters.find((f) => f.id === "day")?.value as Date, "yyyy-MM-dd"), refetchInterval)

  const deletionMutation = useMessageDeletionMutation()

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
    getExpandedRowModel: getExpandedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,

    debugAll: true,
  })

  async function onDelete(id: number) {
    toast.promise(deletionMutation.mutateAsync(id), {
      position: "top-center",
      loading: "删除中...",
      success: () => {
        refetch()
        return "删除成功"
      },
      error: (error) => {
        const errorMessage = getFetchErrorMessage(error)
        return t(errorMessage)
      },
    })
  }

  return (
    <div>
      <div className="relative">
        <div className="my-4 flex items-center justify-between">
          <DatePicker
            mode="single"
            required
            selected={filter?.value as Date}
            onSelect={(date: any) => table.setColumnFilters((old) => {
              const index = old.findIndex((o) => o.id === "day")
              if (index !== -1) old![index]!["value"] = date
              else old.push({ id: "day", value: date })
              table.setPageIndex(0)
              table.resetExpanded(true)
              return old
            })}
          />
          <Button variant="ghost" title="刷新" disabled={isFetching || isRefetching} onClick={() => refetch()}>
            <HistoryIcon className={isFetching || isRefetching ? "animate-spin" : ""} size={16} />
            <span className="sr-only">刷新</span>
          </Button>

          <Refresher onValueChange={(v: string) => {
            let vv: boolean | number = false
            if (v !== "off") {
              vv = Number.parseInt(v)
            }
            setRefetchInterval(vv)
          }}
          />
        </div>
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
                    <TableRow className={row.getValue("status") === "Deleted" ? "text-slate-400" : ""}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.id.endsWith("actions") && row.getValue("status") !== "Deleted" ? (
                            <Button variant="destructive" title="删除" disabled={deletionMutation.isPending} onClick={() => onDelete(row.getValue("id"))}>
                              <Trash size={16} />
                              <span className="sr-only">删除</span>
                            </Button>
                          ) : flexRender(
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
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={table.getVisibleFlatColumns().length}>
                  页面小计:
                  {" ¥"}
                  {messages.summary?.page_total ?? 0}
                  /
                  总计:
                  {" ¥"}
                  {messages.summary?.total ?? 0}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <DataTablePagination table={table} />
        {(isFetching || isRefetching) && (
          <div className="absolute left-0 top-0 flex size-full items-center justify-center text-sm text-accent-foreground backdrop-blur-sm">
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
    enableHiding: false,
  },
  {
    accessorKey: "day",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:day")} />
    ),
    cell: ({ row }) => row.getValue("day"),
    enableSorting: false,
    enableHiding: false,

  },
  {
    accessorKey: "method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:method")} />
    ),
    cell: ({ row }) => row.getValue("method"),
    enableHiding: false,

  },
  {
    accessorKey: "numbers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:numbers")} />
    ),
    cell: ({ row }) => (row.getValue("numbers") as string[]).join(", "),
    enableHiding: false,
  },
  {
    accessorKey: "times",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:times")} />
    ),
    cell: ({ row }) => ` x ${row.getValue("times")}`,
    enableHiding: false,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:price")} />
    ),
    cell: ({ row }) => ` = ¥ ${row.getValue("price")}`,
    enableHiding: false,
  },
  {
    accessorKey: "prize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:prize")} />
    ),
    cell: ({ row }) => `¥ ${row.getValue("prize")}`,
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:created_at")} />
    ),
    cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", weekday: undefined, hour: "2-digit", hour12: false, minute: "2-digit", second: "2-digit" }),
    enableHiding: false,

  },
]
