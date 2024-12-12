import { HistoryIcon } from "lucide-react"
import { useState } from "react"

import { DatePicker } from "@/components/date-picker"
import { Refresher } from "@/components/refresher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNumbers } from "@/hooks/query/use-number"

export function Component() {
  const [tab, setTab] = useState("福")
  const [day, setDay] = useState(() => new Date())
  const [refetchInterval, setRefetchInterval] = useState<number | boolean>(false)
  const { data, refetch, isFetching, isRefetching } = useNumbers(tab, day, refetchInterval)

  return (
    <>
      <Tabs defaultValue={tab} onValueChange={setTab} className="space-y-4">
        <div className="my-4 flex items-center justify-between space-x-4">
          <TabsList>
            <TabsTrigger value="福">福</TabsTrigger>
            <TabsTrigger value="体">体</TabsTrigger>
          </TabsList>
          <DatePicker
            mode="single"
            required
            selected={day}
            onSelect={(date) => setDay(date!)}
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
      </Tabs>
      <div className="grid flex-1 scroll-mt-20 grid-cols-4 items-start gap-4 md:grid-cols-5 md:gap-4 lg:grid-cols-8 lg:gap-3 xl:grid-cols-9 xl:gap-2 2xl:grid-cols-12 2xl:gap-2">
        {data?.map((number) => (
          <div key={number.id} className="flex aspect-square flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 text-sm font-medium leading-none hover:bg-accent hover:text-accent-foreground">
            <span className="relative flex size-12 shrink-0 overflow-hidden rounded-full bg-sidebar-primary  text-sidebar-primary-foreground">
              <span className="flex size-full items-center justify-center rounded">{number.number}</span>
            </span>
            <Badge variant="outline" className="text-nowrap bg-muted text-muted-foreground">¥ {number.prize}</Badge>
          </div>
        ))}
      </div>
    </>
  )
}
