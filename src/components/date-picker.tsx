import { CalendarIcon } from "@radix-ui/react-icons"
import format from "date-fns/format"
import type { DayPickerSingleProps } from "react-day-picker"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export function DatePicker({
  mode,
  className,
  selected,
  onSelect,
  required,
}: DayPickerSingleProps) {
  return (
    <div className="flex flex-1 items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-auto text-left font-normal",
              className,
              !selected && "text-muted-foreground",
            )}
          >
            {selected ? (
              format(selected, "P")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode={mode}
            required={required}
            selected={selected}
            onSelect={onSelect}
            disabled={(date) =>
              date > new Date() || date < new Date("2024-12-01")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
