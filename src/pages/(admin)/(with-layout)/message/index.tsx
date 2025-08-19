import type { ColumnDef, ColumnFiltersState, ExpandedState, PaginationState } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import clsx from "clsx"
import { format } from "date-fns"
import { t } from "i18next"
import { useAtom } from "jotai"
import { CircleCheck, CircleX, Hourglass, MessageCircleDashed, RefreshCwIcon, Trash, TriangleAlert, UserRound, X } from "lucide-react"
import * as React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { authTokenAtom } from "@/atoms/auth"
import { DatePicker } from "@/components/date-picker"
import { Icons } from "@/components/icons"
import { Refresher } from "@/components/refresher"
import { Summary } from "@/components/summary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMessageDeletionMutation, useMessages } from "@/hooks/query/use-message"
import { useUsers } from "@/hooks/query/use-user"
import { i18n } from "@/i18n"
import { getFetchErrorMessage } from "@/lib/api-fetch"
import { useSummaryCtx } from "@/providers/summary-provider"
import type { MessageStatus, Order } from "@/schema/message"
import { messageStatusSchema } from "@/schema/message"

import { columns, today } from "./components/columns"
import { DataTableColumnHeader } from "./components/data-table-column-header"
import { DataTablePagination } from "./components/data-table-pagination"
import { OrderTable } from "./components/order-table"

export const statusList = [
  { value: "Deleted", label: "删除", icon: () => <Trash className="mr-2 size-4 text-slate-400" /> },
  { value: "Revoked", label: "撤回", icon: () => <MessageCircleDashed className="mr-2 size-4 text-gray-300" /> },
  { value: "Finished", label: "成功", icon: () => <CircleCheck className="mr-2 size-4 text-green-500" /> },
  { value: "Failed", label: "失败", icon: () => <CircleX className="mr-2 size-4 text-red-500" /> },
  { value: "Pending", label: "等待", icon: () => <Hourglass className="mr-2 size-4 text-yellow-400" /> },
  { value: "Warning", label: "可疑", icon: () => <TriangleAlert className="mr-2 size-4 text-orange-500" /> },
]

export function Component() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [number, setNumber] = useState<string>("")
  const [lotto, setLotto] = useState<string>()
  const [method, setMethod] = useState<string>()
  const [userIds, setUserIds] = useState<string[]>([])
  const [status, setStatus] = useState<MessageStatus[]>([])
  const { setDay: setSummaryDay } = useSummaryCtx()

  const [authToken, _] = useAtom(authTokenAtom)
  const isAdmin = authToken.is_admin

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
      value: userIds,
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
    userIds ? userIds.map((n) => Number.parseInt(n)) : undefined,
    status,
    refetchInterval,
  )
  const { data: users, fetch: fetchUsers } = useUsers({ pageIndex: 0, pageSize: 1000 })

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

  useEffect(() => {
    if (!isAdmin) {
      table.getColumn("user_id")?.toggleVisibility(false)
    }
  }, [isAdmin, table])

  useEffect(() => {
    if (isAdmin && !users) { fetchUsers() }
  }, [isAdmin, fetchUsers, users])

  return (
    <div className="relative">
      <Summary />

      <DataTablePagination
        table={table}
        extra={(
          <div className="flex items-center justify-between space-x-4">
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
                    setSummaryDay(date)
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
                    table.setPageIndex(0)
                    table.resetExpanded(true)
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
                      table.setPageIndex(0)
                      table.resetExpanded(true)
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
                    table.setPageIndex(0)
                    table.resetExpanded(true)
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
                      table.setPageIndex(0)
                      table.resetExpanded(true)
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
                    if (e.target.value.length === 3) {
                      table.setPageIndex(0)
                      table.resetExpanded(true)
                    }
                  }}
                />
                {number && (
                  <button
                    type="button"
                    onClick={() => {
                      setNumber("")
                      table.setPageIndex(0)
                      table.resetExpanded(true)
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-accent/40 p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <X className="size-2" />
                  </button>
                )}
              </div>
              <div className="relative">
                <MultiSelect
                  options={statusList}
                  onValueChange={(v) => {
                    table.setPageIndex(0)
                    table.resetExpanded(true)
                    setStatus(v.map((s) => messageStatusSchema.parse(s)))
                  }}
                  defaultValue={status}
                  placeholder="状态"
                  variant="inverted"
                  animation={2}
                  maxCount={3}
                  className="h-9 min-h-9 shadow-sm"
                />
              </div>
              {isAdmin && (
                <>
                  <Separator orientation="vertical" decorative className="h-9" />
                  <div className="relative">
                    {!!users?.results && (
                      <MultiSelect
                        options={users.results.map((u) => ({ value: u.id.toString(), label: u.name }))}
                        onValueChange={(v) => {
                          table.setPageIndex(0)
                          table.resetExpanded(true)
                          setUserIds(v)
                        }}
                        defaultValue={userIds}
                        placeholder="用户"
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                        className="h-9 min-h-9 shadow-sm"
                      />
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
              table.setPageIndex(0)
              table.resetExpanded(true)
            }}
            />
          </div>
        )}
      />
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
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableHeader className="bg-muted/50 font-medium hover:bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx({
                      "w-14 max-w-14": ["select", "status", "actions"].includes(header.column.id),
                      "w-48 max-w-48": header.column.id === "id",
                      "w-24 max-w-40": header.column.id === "ts",
                    })}
                  >
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
              table.getRowModel().rows.map((row, idx) => (
                <React.Fragment key={row.id}>
                  <TableRow className={clsx({
                    "bg-gray hover:bg-gray": idx % 2 === 0,
                    "bg-muted hover:bg-muted": idx % 2 === 1,
                    "text-slate-400 line-through": ["Deleted", "Revoked"].includes(row.getValue("status")),
                    "border-transparent": row.getIsExpanded(),
                  })}
                  >
                    {row.getVisibleCells().map((cell, idx) => (
                      <TableCell
                        key={cell.id}
                        className={clsx("align-top", {
                          "py-0": idx === 0 || cell.column.id === "actions",
                          "flex justify-center": cell.column.id === "status",
                          "text-center": cell.column.id === "user_id",
                        })}
                      >
                        {cell.column.id === "actions" && !["Deleted", "Failed", "Revoked"].includes(row.getValue("status")) ? (
                          <Button size="sm" variant="link" title="删除" disabled={deletionMutation.isPending || new Date((row.getValue("ts") as number) * 1000).toLocaleDateString("zh-CN") < today} onClick={() => onDelete(row.getValue("id"))} className="group">
                            <Trash size={16} className="text-destructive group-disabled:text-slate-400" />
                            <span className="sr-only">删除</span>
                          </Button>
                        ) : cell.column.id === "user_id" && !!users ?
                            (
                              <Button
                                variant="outline"
                                size="sm"
                                className={clsx("h-5 px-1 font-semibold text-blue-700", { "line-through text-blue-700/30": ["Deleted", "Revoked"].includes(row.getValue("status")) })}
                                onClick={(_ev) => {
                                  setUserIds([row.getValue("user_id")])
                                  table.setPageIndex(0)
                                  table.resetExpanded(true)
                                }}
                              >
                                <UserRound size={12} />
                                {users.results.find((u) => u.id === row.getValue("user_id"))?.name}
                              </Button>
                            ) :
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && row.getCanExpand() && (
                    <TableRow className={clsx("border-b transition-colors", {
                      "bg-gray hover:bg-gray": idx % 2 === 0,
                      "bg-muted hover:bg-muted": idx % 2 === 1,
                    })}
                    >
                      <TableCell />
                      <TableCell colSpan={row.getVisibleCells().length - 1}>
                        <OrderTable columns={order_columns} data={row.original.orders} />
                      </TableCell>
                    </TableRow>
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
      <DataTableColumnHeader column={column} title={i18n.t("message:lotto")} className="justify-center" />
    ),
    cell: ({ row }) => row.getValue("lotto"),
    enableHiding: false,
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
    cell: ({ row }) => new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      maximumFractionDigits: 0,
    }).format(row.getValue("price")),
    enableHiding: false,
  },
  {
    accessorKey: "prize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:prize")} />
    ),
    cell: ({ row }) => new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      maximumFractionDigits: 0,
    }).format(row.getValue("prize")),
    enableHiding: false,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={i18n.t("message:created_at")} />
    ),
    cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString("zh-CN", { year: "numeric", month: "numeric", day: "numeric", weekday: undefined, hour: "2-digit", hour12: false, minute: "2-digit", second: "2-digit" }).replace(new Date().toLocaleDateString("zh-CN"), "").trim(),
    enableHiding: false,

  },
]
