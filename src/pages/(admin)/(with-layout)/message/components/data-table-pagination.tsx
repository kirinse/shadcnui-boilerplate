import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  extra?: any
}

const PAGINATION_STEP = 3 // You can easily change this value to adjust the pagination step

export function DataTablePagination<TData>({
  table,
  extra,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation("pagination")

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {extra}
        {/* {table.getPageCount() > 0 && (
          <>
            {t("page")}
            {" "}
            {table.getState().pagination.pageIndex + 1}
            {" "}
            /
            {" "}
            {table.getPageCount().toLocaleString()}
          </>
        )} */}
      </div>
      <div className="space-x-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                className="hidden size-9 p-0 lg:flex"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <DoubleArrowLeftIcon className="size-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious className="size-9 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />
            </PaginationItem>

            {(() => {
              const currentPage = table.getState().pagination.pageIndex
              const totalPages = table.getPageCount()
              const visiblePages = []
              const addPage = (index: number) => {
                visiblePages.push(
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => {
                        table.setPageIndex(index)
                      }}
                      isActive={currentPage === index}
                    >

                      {String(index + 1)}
                    </PaginationLink>
                  </PaginationItem>,
                )
              }

              // Always show first page
              addPage(0)

              if (totalPages <= 7) {
                // If total pages are 7 or less, show all pages
                for (let i = 1; i < totalPages; i++) {
                  addPage(i)
                }
              } else {
                let startPage = Math.max(1, currentPage - 1)
                let endPage = Math.min(totalPages - 2, currentPage + 1)

                // Adjust start and end page to always show 3 pages when possible
                if (startPage === 1) {
                  endPage = Math.min(3, totalPages - 2)
                } else if (endPage === totalPages - 2) {
                  startPage = Math.max(1, totalPages - 4)
                }

                // Show ellipsis at the start if needed
                if (startPage > 1) {
                  visiblePages.push(
                    <PaginationEllipsis
                      key="ellipsis1"
                      onClick={() => table.setPageIndex(Math.max(0, currentPage - PAGINATION_STEP))}
                    />,
                  )
                }

                // Add visible pages
                for (let i = startPage; i <= endPage; i++) {
                  addPage(i)
                }

                // Show ellipsis at the end if needed
                if (endPage < totalPages - 2) {
                  visiblePages.push(
                    <PaginationEllipsis
                      key="ellipsis2"
                      onClick={() => table.setPageIndex(Math.min(totalPages - 1, currentPage + PAGINATION_STEP))}
                    />,
                  )
                }

                // Always show last page
                addPage(totalPages - 1)
              }

              return visiblePages
            })()}

            <PaginationItem>
              <PaginationNext className="size-9 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="ghost"
                className="hidden size-9 p-0 lg:flex"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <DoubleArrowRightIcon className="size-4" />
              </Button>

            </PaginationItem>
            <PaginationItem>
              <Select value={table.getState().pagination.pageSize.toString()} onValueChange={(value) => table.setPageSize(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a page size" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize} / {t("page")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
