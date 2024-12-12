import type { Table } from "@tanstack/react-table"

import { DatePicker } from "@/components/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const filter = table.getState().columnFilters.find((filters) => filters.id === "day")
  const onSelected = (date: any) => table.setColumnFilters((old) => {
    const index = old.findIndex((o) => o.id === "day")
    if (index !== -1) old![index]!["value"] = date
    else old.push({ id: "day", value: date })
    table.setPageIndex(0)
    table.resetExpanded(true)
    return old
  })

  return (
    <div className="my-4 flex items-center justify-between">
      <DatePicker mode="single" selected={filter?.value as Date} onSelect={onSelected} />

      <Select defaultValue="off">
        <SelectTrigger className="ml-auto w-[110px]" aria-label="Edit">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="off">关闭</SelectItem>
          <SelectItem value="10000">10 秒</SelectItem>
          <SelectItem value="30000">30 秒</SelectItem>
          <SelectItem value="60000">1 分钟</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
