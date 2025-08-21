"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatchMutation } from "@/hooks/query/use-wechat"
// import { useAuth } from "@/providers/auth-provider"
import { useSummaryCtx } from "@/providers/summary-provider"
import type { IRisk } from "@/schema/number"
import type { DispatchForm } from "@/schema/wechat"
import { dispatchFormSchema, lottoType, lottoTypeSchema } from "@/schema/wechat"

import { Icons } from "./icons"
import { Checkbox } from "./ui/checkbox"
// import { SelectContentGrid, SelectItemGrid } from "./select-content"
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Input } from "./ui/input"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { ScrollArea } from "./ui/scroll-area"
import { Textarea } from "./ui/textarea"

const items = [
  {
    id: "combo3",
    label: "组三",
  },
  {
    id: "full_house",
    label: "豹子",
  },
] as const
interface Props {
  open?: boolean
}

function is_combo3(number: string) {
  return new Set(number.split("")).size === 2
}

function is_full_house(number: string) {
  return new Set(number.split("")).size === 1
}

export function DispatchDialog({ open }: Props) {
  const { lotto, setLotto, risk, setRiskEnabled } = useSummaryCtx()
  const [keep, setKeep] = useState(0)
  const [filter, setFilter] = useState<string[]>([])

  const riskData = useMemo(() => {
    let data = risk ?? []
    if (keep > 0) {
      data = data.filter(([bets]) => Number.parseInt(bets) > keep)
    }
    if (filter.length > 0 && filter.includes("combo3")) {
      const d: [string, IRisk[]][] = []
      for (const [bets, numbers] of data) {
        const filtered = numbers.filter((n) => !is_combo3(n.number))
        if (filtered.length > 0) {
          d.push([bets, filtered])
        }
      }
      data = d
    }
    if (filter.length > 0 && filter.includes("full_house")) {
      const d: [string, IRisk[]][] = []
      for (const [bets, numbers] of data) {
        const filtered = numbers.filter((n) => !is_full_house(n.number))
        if (filtered.length > 0) {
          d.push([bets, filtered])
        }
      }
      data = d
    }
    return data
  }, [keep, risk, filter])

  const content = useMemo(() => {
    return riskData?.map(([bets, numbers]) => {
      const n = numbers.map((n) => n.number)
      return `${lotto}彩 ${n.join(" ")} ${numbers.length > 9 ? `共${numbers.length}注 ` : ""}直选${Number.parseInt(bets) - keep}单\n`
    }).join("\n") || ""
  }, [keep, lotto, riskData])

  const form = useForm<DispatchForm>({
    resolver: zodResolver(dispatchFormSchema),
    values:
    {
      // pid: user?.pid || "",
      // toWxId: "",
      // appId: "",
      lotto,
      content,
      keep,
      filter,
    },
  })
  const dispatchMutation = useDispatchMutation()

  function onSubmit(_values: DispatchForm) {
    // console.log(values)
    return
    // toast.promise(dispatchMutation.mutateAsync(values), {
    //   position: "top-center",
    //   loading: `正在发送消息`,
    //   success: (_data) => {
    //     // console.log(data)
    //     form.reset()
    //     // setForm(values)
    //     // setQr(data)
    //     // setOpen("qr")
    //     return "消息发送成功"
    //   },
    //   error: (error) => {
    //     const errorMessage = getFetchErrorMessage(error)
    //     return t(errorMessage)
    //   },
    // })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset()
          setLotto("福")
          setKeep(0)
          setFilter([])
          setRiskEnabled(false)
          return
        }
        setRiskEnabled(true)
      }}
    >
      <DialogTrigger asChild><Button>抛单</Button></DialogTrigger>
      <DialogContent className="xs:h-full sm:max-w-2xl" onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="flex-row justify-between text-left">
          <div className="flex flex-col">
            <DialogTitle>抛单</DialogTitle>
            <DialogDescription>通过微信发送抛单消息</DialogDescription>
          </div>
          <div />
        </DialogHeader>
        <div className="w-full overflow-y-auto py-1">
          <Form {...form}>
            <form
              id="dispatch-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              {/* <FormField
                control={form.control}
                name="pid"
                render={({ field }) => (
                  <input type="hidden" name={field.name} value={field.value} />
                )}
              /> */}
              <div className="flex gap-4">
                {/* <FormField
                  control={form.control}
                  name="appId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>微信</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择微信" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContentGrid>
                          {user?.apps.map((app) => (
                            <SelectItemGrid key={app.id} value={app.id} disabled={!app.online}>
                              <div>
                                <Avatar className="size-6 rounded-sm">
                                  <AvatarImage src={app.avatar} className={clsx({ grayscale: !app.online })} />
                                  <AvatarFallback className="rounded-lg">
                                    {app.name?.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            </SelectItemGrid>
                          ))}
                        </SelectContentGrid>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toWxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        发送给
                      </FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择接收者" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lottoType.map((lotto) => (<SelectItem key={lotto} value={lotto}>{`${lotto}彩`}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="lotto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        彩种
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(v) => {
                            field.onChange(v)
                            setLotto(lottoTypeSchema.parse(v))
                            setKeep(1)
                            // form.setValue("keep", 1)
                          }}
                          defaultValue={field.value}
                          className="gap-1"
                        >
                          {lottoType.map((v) => (
                            <FormItem key={v} className="flex items-center gap-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={v} />
                              </FormControl>
                              <FormLabel className="flex cursor-pointer items-center gap-1 font-normal">
                                {`${v}彩`} {/* v === lotto && <RefreshCw size={14} onClick={() => refetchRisk()} /> */}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        保留
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-1">
                          <Input
                            onChange={(v) => {
                              field.onChange(Number.parseInt(v.currentTarget.value))
                              setKeep(Number.parseInt(v.currentTarget.value))
                            }}
                            value={field.value}
                            type="number"
                            min={0}
                            maxLength={3}
                            className="w-[70px]"
                          />
                          单
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="filter"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        排除
                      </FormLabel>
                      <div>
                        {items.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="filter"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-center gap-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange([...field.value, item.id])
                                          setFilter([...field.value, item.id])
                                        } else {
                                          const v = field.value?.filter(
                                            (value) => value !== item.id,
                                          )
                                          field.onChange(v)
                                          setFilter(v)
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium leading-none">
                  选择号码、注数
                </span>
                <ScrollArea className="h-32 w-full rounded-md border p-3">
                  <div className="grid auto-cols-max grid-cols-3 gap-2">
                    {riskData?.map(([bets, numbers]) => {
                      const n = numbers.map((n) => n.number)
                      return (
                        <div
                          key={bets}
                          className="cursor-pointer rounded-sm border p-2 hover:bg-accent hover:text-accent-foreground"
                          onClick={() => {
                            form.setValue("content", `${form.getValues().content}\n直选${bets}单\n${n.join(",")}\n`)
                          }}
                        >
                          <div className="flex flex-col gap-1">
                            <h3 className="text-xs font-semibold">直选 {bets} 单</h3>
                            <div className="text-wrap break-all text-xs">{n.join(",")}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <Textarea rows={10} name={field.name} value={field.value} onChange={field.onChange} />
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button type="submit" form="dispatch-form" disabled={dispatchMutation.isPending || true}>
            {dispatchMutation.isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
