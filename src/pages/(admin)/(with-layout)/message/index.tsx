import type { ColumnDef, ColumnFiltersState, ExpandedState, PaginationState } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { t } from "i18next"
import { useAtom } from "jotai"
import { CircleCheck, CircleX, Hourglass, RefreshCwIcon, Trash, X } from "lucide-react"
import * as React from "react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { authTokenAtom } from "@/atoms/auth"
import { DatePicker } from "@/components/date-picker"
import { Icons } from "@/components/icons"
import { Refresher } from "@/components/refresher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMessageDeletionMutation, useMessages } from "@/hooks/query/use-message"
import { useUsers } from "@/hooks/query/use-user"
import { i18n } from "@/i18n"
import { getFetchErrorMessage } from "@/lib/api-fetch"
import type { MessageStatus, Order } from "@/schema/message"
import { messageStatusSchema } from "@/schema/message"

import { columns } from "./components/columns"
import { DataTableColumnHeader } from "./components/data-table-column-header"
import { DataTablePagination } from "./components/data-table-pagination"
import { OrderTable } from "./components/order-table"

export function Component() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [number, setNumber] = useState<string>("")
  const [lotto, setLotto] = useState<string>()
  const [method, setMethod] = useState<string>()
  const [userId, setUserId] = useState<string>("")
  const [status, setStatus] = useState<MessageStatus>()

  const [authToken, _] = useAtom(authTokenAtom)
  const isAdmin = useMemo(() => authToken.is_admin, [authToken])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    [{
      id: "day",
      value: new Date(),
    }, {
      id: "lotto",
      value: lotto,
    }, {
      id: "method",
      value: method,
    }, {
      id: "number",
      value: number,
    }, {
      id: "user_id",
      value: userId,
    }, {
      id: "status",
      value: status,
    }],
  )
  const [refetchInterval, setRefetchInterval] = useState<number | boolean>(false)

  const filter = columnFilters.find((filters) => filters.id === "day")

  const { data: messages, isFetching, isRefetching, refetch } = useMessages(
    pagination,
    format(filter?.value as Date, "yyyy-MM-dd"),
    lotto || undefined,
    method || undefined,
    number && number.length === 3 ? number : undefined,
    userId ? Number.parseInt(userId) : undefined,
    status,
    refetchInterval,
  )
  const { data: users } = useUsers({ pageIndex: 1, pageSize: 1000 })

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

    debugAll: false,
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
    <div className="relative">
      <div className="my-4 flex items-center justify-between space-x-4">
        <div className="flex flex-1 space-x-4">
          <div>
            <DatePicker
              className="flex-none"
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
          </div>
          <div className="relative">
            <Select
              value={lotto}
              onValueChange={(v) => {
                setLotto(v)
                table.setColumnFilters((old) => {
                  table.setPageIndex(0)
                  table.resetExpanded(true)
                  return old
                })
              }}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder="彩种" />
              </SelectTrigger>
              <SelectContent className="w-[90px]">
                <SelectItem value="福">福彩</SelectItem>
                <SelectItem value="体">体彩</SelectItem>
              </SelectContent>
            </Select>
            {lotto && (
              <button
                type="button"
                onClick={() => {
                  setLotto("")
                  table.setColumnFilters((old) => {
                    table.setPageIndex(0)
                    table.resetExpanded(true)
                    return old
                  })
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-accent/40 p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <X className="size-2" />
              </button>
            )}
          </div>
          <div className="relative">
            <Select
              value={method}
              onValueChange={(v) => {
                setMethod(v)
                table.setColumnFilters((old) => {
                  table.setPageIndex(0)
                  table.resetExpanded(true)
                  return old
                })
              }}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder="玩法" />
              </SelectTrigger>
              <SelectContent className="w-[90px]">
                <SelectItem value="单">单</SelectItem>
                <SelectItem value="复">复</SelectItem>
                <SelectItem value="豹">豹</SelectItem>
                <SelectItem value="组三">组三</SelectItem>
                <SelectItem value="组六">组六</SelectItem>
                <SelectItem value="三码组三">三码组三</SelectItem>
                <SelectItem value="四码组三">四码组三</SelectItem>
                <SelectItem value="五码组三">五码组三</SelectItem>
                <SelectItem value="六码组三">六码组三</SelectItem>
                <SelectItem value="七码组三">七码组三</SelectItem>
                <SelectItem value="四码组六">四码组六</SelectItem>
                <SelectItem value="五码组六">五码组六</SelectItem>
                <SelectItem value="六码组六">六码组六</SelectItem>
                <SelectItem value="七码组六">七码组六</SelectItem>
                <SelectItem value="独胆">独胆</SelectItem>
                <SelectItem value="双飞">双飞</SelectItem>
                <SelectItem value="单码定位">单码定位</SelectItem>
                <SelectItem value="双飞定位">双飞定位</SelectItem>
                <SelectItem value="包对子">包对子</SelectItem>
                <SelectItem value="包豹子">包豹子</SelectItem>
                <SelectItem value="胆直271">胆直271</SelectItem>
                <SelectItem value="胆直270">胆直270</SelectItem>
              </SelectContent>
            </Select>
            {method && (
              <button
                type="button"
                onClick={() => {
                  setMethod("")
                  table.setColumnFilters((old) => {
                    table.setPageIndex(0)
                    table.resetExpanded(true)
                    return old
                  })
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-accent/40 p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <X className="size-2" />
              </button>
            )}
          </div>
          <div className="relative">
            <Select
              value={status || ""}
              onValueChange={(v) => {
                setStatus(messageStatusSchema.parse(v))
                table.setColumnFilters((old) => {
                  table.setPageIndex(0)
                  table.resetExpanded(true)
                  return old
                })
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">
                  <div className="flex items-center">
                    <Hourglass size={16} xlinkTitle="等待" className="text-orange-500" />
                    待处理
                  </div>
                </SelectItem>
                <SelectItem value="Finished">
                  <div className="flex items-center gap-1">
                    <CircleCheck size={16} className="text-green-500" />
                    成功
                  </div>
                </SelectItem>
                <SelectItem value="Failed">
                  <div className="flex items-center gap-1">
                    <CircleX size={16} className="text-red-500" />
                    失败
                  </div>
                </SelectItem>
                <SelectItem value="Deleted">
                  <div className="flex items-center gap-1">
                    <Trash size={16} className="text-slate-400" />
                    已删除
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {status && (
              <button
                type="button"
                onClick={() => {
                  setStatus(undefined)
                  table.setColumnFilters((old) => {
                    table.setPageIndex(0)
                    table.resetExpanded(true)
                    return old
                  })
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-accent/40 p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <X className="size-2" />
              </button>
            )}
          </div>
          <div className="relative">
            <Input
              type="number"
              min={1}
              max={999}
              maxLength={3}
              className="w-[80px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="号码"
              value={number}
              onChange={(e) => {
                // const v = e.target.value || undefined
                // if (v !== undefined && v.length < 3) { return }
                setNumber(e.target.value)
              }}
            />
            {number && (
              <button
                type="button"
                onClick={() => {
                  setNumber("")
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-accent/40 p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <X className="size-2" />
              </button>
            )}
          </div>
          {isAdmin && (
            <>
              <Separator orientation="vertical" decorative className="h-9" />
              <div className="relative">
                <Select
                  value={userId}
                  onValueChange={(v) => {
                    setUserId(v)
                    table.setColumnFilters((old) => {
                      table.setPageIndex(0)
                      table.resetExpanded(true)
                      return old
                    })
                  }}
                >
                  <SelectTrigger className="w-[90px]">
                    <SelectValue placeholder="用户" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {userId && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserId("")
                      table.setColumnFilters((old) => {
                        table.setPageIndex(0)
                        table.resetExpanded(true)
                        return old
                      })
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-accent/40 p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <X className="size-2" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        <Button variant="ghost" title="刷新" disabled={isFetching || isRefetching} onClick={() => refetch()}>
          <RefreshCwIcon className={isFetching || isRefetching ? "animate-spin" : ""} size={16} />
          <span className="sr-only">刷新</span>
        </Button>

        <Refresher onValueChange={(v: string) => {
          let vv: boolean | number = false
          if (v !== "off") {
            vv = Number.parseInt(v)
          }
          setRefetchInterval(vv)
          table.setColumnFilters((old) => {
            table.setPageIndex(0)
            table.resetExpanded(true)
            return old
          })
        }}
        />
      </div>
      <DataTablePagination table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50 font-medium">
            <TableRow>
              <TableCell colSpan={table.getVisibleFlatColumns().length}>
                页面小计:
                {new Intl.NumberFormat("zh-CN", {
                  style: "currency",
                  currency: "CNY",
                  maximumFractionDigits: 0,
                }).format(messages.summary?.page_total ?? 0)}
                /总计
                {` `}
                {messages.summary?.total ?
                  Object.entries(messages.summary?.total).map(([k, v]) => (
                    <React.Fragment key={k}>
                      <span className="text-red-500">{k}:</span>
                      {new Intl.NumberFormat("zh-CN", {
                        style: "currency",
                        currency: "CNY",
                        maximumFractionDigits: 0,
                      }).format(v)}
                    </React.Fragment>
                  )) :
                  ""}
              </TableCell>
            </TableRow>
          </TableHeader>
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
                  <TableRow className={`${row.getIsExpanded() ? "bg-muted" : ""} ${row.getValue("status") === "Deleted" ? "text-slate-400 line-through" : ""} ${row.getIsExpanded() ? "border-transparent" : ""}`}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.id.endsWith("actions") && row.getValue("status") !== "Deleted" && row.getValue("status") !== "Failed" ? (
                          <Button size="sm" variant="ghost" title="删除" disabled={deletionMutation.isPending} onClick={() => onDelete(row.getValue("id"))}>
                            <Trash size={16} className="text-destructive" />
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
                    <tr className="border-b bg-muted transition-colors hover:bg-muted/50">
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
                {new Intl.NumberFormat("zh-CN", {
                  style: "currency",
                  currency: "CNY",
                  maximumFractionDigits: 0,
                }).format(messages.summary?.page_total ?? 0)}
                /总计
                {` `}
                {messages.summary?.total ?
                  Object.entries(messages.summary?.total).map(([k, v]) => (
                    <React.Fragment key={k}>
                      <span className="text-red-500">{k}:</span>
                      {new Intl.NumberFormat("zh-CN", {
                        style: "currency",
                        currency: "CNY",
                        maximumFractionDigits: 0,
                      }).format(v)}
                    </React.Fragment>
                  )) :
                  ""}
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
