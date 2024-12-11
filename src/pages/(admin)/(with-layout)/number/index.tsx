import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNumbers } from "@/hooks/query/use-number"

export function Component() {
  const [tab, setTab] = useState("福")
  const [day, setDay] = useState(() => new Date())
  const { data } = useNumbers(tab, day)

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="space-y-4">
        <div className="my-4 flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="福">福</TabsTrigger>
            <TabsTrigger value="体">体</TabsTrigger>
          </TabsList>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] pl-3 text-left font-normal"
              >
                {day ? (
                  format(day, "P")
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
                selected={day}
                onSelect={(date) => setDay(date!)}
                disabled={(date) =>
                  date > new Date() || date < new Date("2024-12-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </Tabs>
      <div className="grid flex-1 scroll-mt-20 grid-cols-4 items-start gap-4 md:grid-cols-5 md:gap-4 lg:grid-cols-8 lg:gap-3 xl:grid-cols-9 xl:gap-2 2xl:grid-cols-12 2xl:gap-2">
        {data?.map((number) => (
          <div key={number.id} className="flex aspect-square flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 text-sm font-medium leading-none hover:bg-accent hover:text-accent-foreground">
            <span className="relative flex size-12 shrink-0 overflow-hidden rounded-full bg-sidebar-primary  text-sidebar-primary-foreground">
              <span className="flex size-full items-center justify-center rounded">{number.number}</span>
            </span>
            <Badge variant="outline" className="bg-muted text-muted-foreground">¥ {number.prize}</Badge>
          </div>
        ))}
      </div>
    </>
  )
}
