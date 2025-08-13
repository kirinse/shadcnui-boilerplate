import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
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
import * as React from "react"

import { Empty } from "@/components/empty"
import { Loading } from "@/components/loading"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUsers } from "@/hooks/query/use-user"
import type { IUser } from "@/schema/user"

import { DataTableColumnHeader } from "../message/components/data-table-column-header"
import { DataTablePagination } from "../message/components/data-table-pagination"
import { DataTableRowActions } from "./components/data-table-row-actions"
import { UsersDialogs } from "./components/users-dialogs"
import { UsersPrimaryButtons } from "./components/users-primary-buttons"
import UsersProvider from "./context/users-context"

const columns: ColumnDef<IUser>[] = [
  {
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
    accessorKey: "name",
    enableSorting: false,
    header: "用户",
    // cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
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
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="注册时间" />
    ),
    cell: ({ row }) => (
      <div className="lowercase">
        {new Date(row.getValue("created_at")).toLocaleString("zh-CN")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    // cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "操作",
    cell: DataTableRowActions,
  },
]

// TODO: 显示绑定的 wx_ids `smallHeadImgUrl`, chatrooms `smallHeadImgUrl`, recipients (wxid/chatroom `smallHeadImgUrl`)
// TODO: 修改密码: 密码生成按钮/复制按钮/显示、隐藏按钮
// TODO: 修改绑定的 wx_ids, chatrooms, recipients
export function Component() {
  // const [authToken, _] = useAtom(authTokenAtom)
  // const isAdmin = useMemo(() => authToken.is_admin, [authToken])

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
  const { data: users, isPending } = useUsers(pagination, true)

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
                  <TableHead key={header.id}>
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
