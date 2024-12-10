import { CalendarIcon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const filter = table.getState().columnFilters.find((filters) => filters.id === "day")

  return (
    <div className="my-4 flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                // !field.value && "text-muted-foreground",
              )}
            >
              {filter?.value ? (
                format(filter?.value as Date, "P")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              required
              selected={filter?.value as Date}
              onSelect={(date) => table.setColumnFilters((old) => {
                const index = old.findIndex((o) => o.id === "day")
                if (index !== -1) old![index]!["value"] = date
                else old.push({ id: "day", value: date })
                table.setPageIndex(0)
                table.resetExpanded(true)
                return old
              })}
              disabled={(date) =>
                date > new Date() || date < new Date("2024-12-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
