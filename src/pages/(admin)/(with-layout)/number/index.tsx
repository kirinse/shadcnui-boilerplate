import clsx from "clsx"
import { Packer } from "docx"
import { saveAs } from "file-saver"
import { useAtom } from "jotai"
import { RefreshCwIcon, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { authTokenAtom } from "@/atoms/auth"
import { DatePicker } from "@/components/date-picker"
import { DispatchDialog } from "@/components/dispatch-dialog"
import { Refresher } from "@/components/refresher"
import { Summary } from "@/components/summary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNumberDetails, useNumbers, useRisk } from "@/hooks/query/use-number"
import { useUsers } from "@/hooks/query/use-user"
import { getFetchErrorMessage } from "@/lib/api-fetch"
import { DocumentCreator } from "@/lib/risk_generator"
import { useSummaryCtx } from "@/providers/summary-provider"

import { detailsColumns } from "./components/detailsCol"
import { DataTable } from "./components/detailsTable"
import { NumberComp } from "./components/number"

export function Component() {
  const [lotto, setLotto] = useState("福")
  const [day, setDay] = useState(() => new Date())
  const [number, setNumber] = useState<string | undefined>()
  const [detailNumber, setDetailNumber] = useState<string>("")
  const [userId, setUserId] = useState<string>("")

  const [refetchInterval, setRefetchInterval] = useState<number | boolean>(false)
  const { data, refetch, isFetching, isRefetching } = useNumbers(
    lotto,
    day,
    refetchInterval,
    number,
    userId ? Number.parseInt(userId) : undefined,
  )
  const { refetch: riskRefetch, isFetching: riskIsFetching, isRefetching: riskIsRefetching } = useRisk(
    lotto,
    day,
    number,
    userId ? Number.parseInt(userId) : undefined,
  )
  const { data: details } = useNumberDetails(lotto, day, detailNumber, userId ? Number.parseInt(userId) : undefined)
  const { data: users, fetch: fetchUsers } = useUsers({ pageIndex: 0, pageSize: 1000 })

  async function onDownload() {
    toast.promise(riskRefetch, {
      position: "top-center",
      loading: "下载中",
      success: (res) => {
        if (!res.data) {
          toast.info("没有风险号码")
          return
        }
        const documentCreator = new DocumentCreator()
        const doc = documentCreator.create(lotto, day, res.data!, number)
        Packer.toBlob(doc).then((blob) => {
          saveAs(blob, `${day.toLocaleDateString()} ${lotto}彩直选${number ?? ""}报告.docx`)
        })
        return "下载成功"
      },
      error: (error) => {
        const errorMessage = getFetchErrorMessage(error)
        return errorMessage
      },
    })
  }
  const [authToken, _] = useAtom(authTokenAtom)
  const canDownRisk = useMemo(() => authToken.is_verified || authToken.is_admin, [authToken])
  const isAdmin = authToken.is_admin
  const { setDay: setSummaryDay } = useSummaryCtx()

  useEffect(() => {
    if (isAdmin && !users) { fetchUsers() }
  }, [isAdmin, fetchUsers, users])

  return (
    <>
      <Summary />
      <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
        <div className="flex flex-col gap-3 sm:my-4 sm:flex-row">
          <Tabs defaultValue={lotto} onValueChange={setLotto} className="space-y-4">
            <TabsList>
              <TabsTrigger value="福">福</TabsTrigger>
              <TabsTrigger value="体">体</TabsTrigger>
            </TabsList>
          </Tabs>
          <DatePicker
            mode="single"
            required
            selected={day}
            onSelect={(date) => { setDay(date!); setSummaryDay(date!) }}
          />
          <Input
            type="number"
            min={1}
            max={999}
            maxLength={3}
            className="w-[60px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="号码"
            value={number || undefined}
            onChange={(e) => {
              const v = e.target.value || undefined
              if (v !== undefined && v.length > 3) { e.preventDefault(); return }
              setNumber(v)
            }}
          />
          {isAdmin && (
            <div className="inline-flex gap-3">
              <Separator orientation="vertical" decorative className="h-9" />
              <div className="relative">
                <Select value={userId} onValueChange={(v) => setUserId(v)}>
                  <SelectTrigger className="w-[90px]">
                    <SelectValue placeholder="用户" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.results.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {userId && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserId("")
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-accent/40 p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <X className="size-2" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3">
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
          }}
          />
          {canDownRisk && data?.numbers.length ? (
            <Button variant="destructive" title="风险报告" disabled={riskIsFetching || riskIsRefetching} onClick={onDownload}>
              <span>风险报告</span>
            </Button>
          ) : null}
          <DispatchDialog />
        </div>
      </div>
      <div className="grid flex-1 scroll-mt-20 grid-cols-4 items-start gap-4 md:grid-cols-5 md:gap-4 lg:grid-cols-8 lg:gap-3 xl:grid-cols-9 xl:gap-2 2xl:grid-cols-12 2xl:gap-2">
        {data?.numbers.map((number) => {
          const color = {
            "border-red-500 bg-red-500": (number.prize - data.total) / data.total >= 0.1,
            "border-yellow-400 bg-yellow-400": number.prize > data.total && (number.prize - data.total) / data.total < 0.1,
            "border-green-400 bg-green-400": number.prize <= data.total,
          }
          return (
            <Popover
              key={`${lotto}-${number.number}`}
              onOpenChange={(open) => {
                if (open) {
                  setDetailNumber(number.number)
                } else {
                  setDetailNumber("")
                }
              }}
            >
              <PopoverTrigger>
                <div className={clsx("flex aspect-square flex-col items-center justify-around rounded-md border-2 bg-background p-0 text-sm font-medium leading-none hover:bg-accent hover:text-accent-foreground sm:p-4", { "!bg-accent shadow-md": detailNumber === number.number })}>
                  <NumberComp number={number.number} />
                  <Badge variant="outline" className={clsx("text-nowrap text-sidebar-primary-foreground", color)}>
                    {new Intl.NumberFormat("zh-CN", {
                      style: "currency",
                      currency: "CNY",
                      maximumFractionDigits: 0,
                    }).format(number.prize)}
                  </Badge>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto bg-accent shadow-xl">
                {/* <PopoverArrow style={{ fill: "hsl(var(--accent))" }} /> */}
                <div className="leading-9">
                  {`${lotto}彩 ${day.toLocaleDateString("zh-CN")}`}
                  {` `}
                  <NumberComp number={number.number} />
                  {` `}
                  玩法分布
                  {/* </DialogTitle> */}
                  {/* </DialogHeader> */}
                </div>
                {details && (
                  <DataTable columns={detailsColumns} data={details} color={color} />
                )}
              </PopoverContent>
            </Popover>
          )
        })}
      </div>
    </>
  )
}
