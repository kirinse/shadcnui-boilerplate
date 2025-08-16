"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { t } from "i18next"
import { AlertCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLoginMutation } from "@/hooks/query/use-wechat"
import { getFetchErrorMessage } from "@/lib/api-fetch"
import { useWechat } from "@/providers/wechat-provider"
import type { Qr, WechatForm } from "@/schema/wechat"
import { deviceType, regions, wechatFormSchema } from "@/schema/wechat"

import { Icons } from "./icons"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: WechatForm
}

export function WechatDialog({ open, onOpenChange, data }: Props) {
  const { pid, setOpen, setQr, setForm } = useWechat()
  const form = useForm<WechatForm>({
    resolver: zodResolver(wechatFormSchema),
    defaultValues: data ??
      {
        appId: "",
        regionId: "",
        proxyIp: "",
        type: undefined,
      },
  })
  const loginMutation = useLoginMutation(pid)

  function onSubmit(values: WechatForm) {
    toast.promise(loginMutation.mutateAsync(values), {
      position: "top-center",
      loading: `正在获取二维码`,
      success: (data: Qr) => {
        form.reset()
        onOpenChange(false)
        setForm(values)
        setQr(data)
        setOpen("qr")
        return "获取二维码成功"
      },
      error: (error) => {
        const errorMessage = getFetchErrorMessage(error)
        return t(errorMessage)
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        // if (!state) {
        form.reset()
        //   setForm(null)
        // }
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>扫码登录</DialogTitle>
        </DialogHeader>
        <div className="w-full overflow-y-auto py-1">
          <Form {...form}>
            <form
              id="wechat-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              <FormField
                control={form.control}
                name="appId"
                render={({ field }) => (
                  <input type="hidden" name={field.name} value={field.value} />
                )}
              />
              <FormField
                control={form.control}
                name="regionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>地区</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择地区" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regions.map(({ value, label }) => (<SelectItem key={value} value={value}>{label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      设备
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex"
                      >
                        {deviceType.map((v) => (
                          <FormItem key={v} className="flex items-center gap-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={v} />
                            </FormControl>
                            <FormLabel className="font-normal">{v}</FormLabel>
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
                name="proxyIp"
                render={({ field }) => (
                  <FormItem hidden>
                    <FormLabel>
                      代理服务器
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="sock5://username:password@ip:port"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Alert variant="destructive" className="mt-6">
            <AlertCircleIcon />
            <AlertTitle>温馨提示</AlertTitle>
            <AlertDescription>
              <ul className="list-inside list-disc text-sm leading-normal">
                <li>登录地址请选择手机微信所在真实地址</li>
                <li>建议 ipad 方式登录，若手机微信显示需要在新设备上验证，请切换 mac 登录</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button type="submit" form="wechat-form" disabled={loginMutation.isPending}>
            {loginMutation.isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
