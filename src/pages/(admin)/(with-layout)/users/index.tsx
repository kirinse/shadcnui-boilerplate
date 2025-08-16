import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import clsx from "clsx"
import * as React from "react"
import { useEffect } from "react"

import { Empty } from "@/components/empty"
import { Loading } from "@/components/loading"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUsers } from "@/hooks/query/use-user"
import { useWechat } from "@/providers/wechat-provider"
import type { IUser } from "@/schema/user"

import { DataTableColumnHeader } from "../message/components/data-table-column-header"
import { DataTablePagination } from "../message/components/data-table-pagination"
import { DataTableRowActions } from "./components/data-table-row-actions"
import { UsersDialogs } from "./components/users-dialogs"
import { UsersPrimaryButtons } from "./components/users-primary-buttons"
import UsersProvider from "./context/users-context"

// TODO: 修改绑定的 wx_ids, chatrooms, recipients
export function Component() {
  // const [authToken, _] = useAtom(authTokenAtom)
  // const isAdmin = useMemo(() => authToken.is_admin, [authToken])
  const { setPid, setOpen: setWxOpen, setForm } = useWechat()

  const columns: ColumnDef<IUser>[] = [
    {
      id: "id",
      accessorKey: "id",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          title="ID"
          column={column}
        />
      ),
    },
    {
      id: "name",
      accessorKey: "name",
      enableSorting: false,
      header: "用户",
    },
    // {
    //     accessorKey: "role",
    //     header: "Role",
    //     cell: ({ row }) => <div className="lowercase">{row.getValue("role")}</div>,
    // },
    // {
    //     accessorKey: "avatar",
    //     header: "Avatar",
    //     cell: ({ row }) => (
    //         <div className="lowercase">
    //             <Avatar>
    //                 {/* <AvatarImage src={row.getValue("avatar")} /> */}
    //                 <AvatarFallback>{row.original.name.slice(0, 2)}</AvatarFallback>
    //             </Avatar>
    //         </div>
    //     ),
    // },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "apps",
      header: "微信",
      cell: ({ row }: { row: Row<IUser> }) => {
        if (row.original.apps.length > 0) {
          return (
            <Menubar className="h-12 border-0 bg-transparent shadow-none">
              {row.original.apps.sort((a, b) => (a.online ? 1 : 0) - (b.online ? 1 : 0)).map((app) => (
                <MenubarMenu key={app.id}>
                  <MenubarTrigger>
                    <Avatar className={clsx("size-12 cursor-pointer shadow-sm ring-2 ring-background duration-150 hover:z-50", { grayscale: !app.online })}>
                      <AvatarImage src={app.avatar} />
                      <AvatarFallback>{app.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </MenubarTrigger>
                  <MenubarContent className="flex justify-between">
                    <MenubarItem onSelect={(e) => { e.preventDefault() }} className="text-lg font-semibold focus:bg-inherit">{app.name}</MenubarItem>
                    <MenubarItem onSelect={(e) => { e.preventDefault() }} className="focus:bg-inherit">
                      {app.online ? (
                        <Button onClick={() => {
                          setPid(row.original.pid)
                          setForm({ type: app.device, appId: app.id, regionId: app.region_id, proxyIp: app.proxy })
                          setWxOpen("wechat-logout")
                        }}
                        >
                          退出
                        </Button>
                      ) : (
                        <Button onClick={() => {
                          setPid(row.original.pid)
                          setForm({ type: app.device, appId: app.id, regionId: app.region_id, proxyIp: app.proxy })
                          setWxOpen("wechat")
                        }}
                        >
                          登录
                        </Button>
                      )}
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              ))}
            </Menubar>
          )
        }
      },
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="注册时间" />
      ),
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleString("zh-CN"),
    },
    {
      id: "actions",
      enableHiding: false,
      header: "操作",
      cell: DataTableRowActions,
    },
  ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { data: users, isPending, fetch: fetchUsers } = useUsers(pagination)

  const table = useReactTable({
    data: users?.results ?? [],
    columns,
    // rowCount: users.total,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  })

  useEffect(() => {
    if (!users) { fetchUsers() }
  }, [fetchUsers, users])

  return (
    <UsersProvider>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div />
        <UsersPrimaryButtons />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={clsx({
                      "w-20 max-w-20": ["id", "name", "actions"].includes(header.column.id),
                      "w-40 max-w-40": ["created_at", "email"].includes(header.column.id),
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isPending ? <Loading /> : <Empty />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <UsersDialogs />
    </UsersProvider>
  )
}
