import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { t } from "i18next"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { AlertCircleIcon } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import ipad_info_img from "/icon_error_code.f3207e96.png"
import mac_info_img from "/icon_step.b1b087b9.png"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCheckMutation, useLoginMutation } from "@/hooks/query/use-wechat"
import { getFetchErrorMessage } from "@/lib/api-fetch"
import { useWechat } from "@/providers/wechat-provider"
import type { CheckResp, DeviceType, Qr } from "@/schema/wechat"
import { deviceTypeSchema } from "@/schema/wechat"

import { Loading } from "./loading"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Button } from "./ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

const QR_TIMEOUT = 300
const CHECK_INTERVAL = 10
const MAX_RETRY = 3

interface Props {
  open: boolean
  onOpenChange?: (open: boolean) => void
}

export function QrDialog({ open }: Props) {
  const { pid, form, qr, setForm, setQr, setOpen } = useWechat()
  const [countdown, setCountdown] = useState<number>(QR_TIMEOUT)
  const loginMutation = useLoginMutation(pid)
  const checkMutation = useCheckMutation(pid)
  const [result, setResult] = useState<CheckResp>()
  const retries = useRef(0)
  const intervalId: any = useRef()
  const [needValidate, setNeedValidate] = useState<boolean | undefined>()
  const [captchaCode, setCaptchaCode] = useState<string>()

  useEffect(() => {
    if (open && !!qr) {
      intervalId.current = setInterval(() => {
        setCountdown((prevCount: number) => {
          // 倒计时未结束
          if (prevCount > 0) {
            // 检查登录状态
            if (prevCount % CHECK_INTERVAL === 0 && !needValidate) {
              checkMutation.mutateAsync({
                appId: qr.appId,
                proxyIp: form?.proxyIp,
                uuid: qr.uuid,
                captchCode: captchaCode,
              }, {
                onSuccess: (data) => {
                  // 已登录成功
                  if ("status" in data && data.status === 2) {
                    setForm(null)
                    setQr(null)
                    setOpen(null)
                    clearInterval(intervalId)
                    toast.success("登录成功")
                    return
                  }
                  // 需要验证
                  if ("code" in data && data.msg.includes("验证")) {
                    setNeedValidate(true)
                    return
                  }
                  setResult(data)
                },
              })
            }
            return prevCount - 1
          } else {
            // 倒计时结束: 使用已保存的 form 内容重新请求, RETRY--
            if (retries.current < MAX_RETRY) {
              loginMutation.mutateAsync({ ...form!, appId: qr.appId }).then((data: Qr) => {
                setQr(data)
                retries.current -= 1
              })
            }
            return QR_TIMEOUT
          }
        })
      }, 1000)
    }
    return () => {
      clearInterval(intervalId.current)
    }
  }, [open, form, loginMutation, qr, setQr, checkMutation, setOpen, setForm, captchaCode, needValidate])

  useEffect(() => {
    if (needValidate === true) {
      clearInterval(intervalId.current)
    }
  }, [needValidate])

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          setForm(null)
          setQr(null)
          setOpen(null)
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl" onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2" />
        </DialogHeader>
        <div className="flex justify-between">
          <div className="w-[250px] flex-none">
            {form?.type === "ipad" && <img src={ipad_info_img} />}
            {form?.type === "mac" && <img src={mac_info_img} className="w-[250px]" />}
          </div>
          <div className={clsx("flex grow flex-col items-center gap-2", { "justify-center": needValidate })}>
            {(!result || ("status" in result && result?.status === 0)) && needValidate === undefined && <QrScreen qrImgBase64={qr?.qrImgBase64} seconds={countdown} type={form?.type} />}
            {!!result && "status" in result && result?.status === 1 && <ScanedScreen avatar={result?.headImgUrl} name={result?.nickName} />}
            {needValidate && (
              <ValidateScreen setCaptcha={(v) => {
                setCaptchaCode(v)
                setNeedValidate(false)
              }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const QrScreen = ({ type, qrImgBase64, seconds }: { type?: DeviceType, qrImgBase64?: string, seconds: number }) => (
  <>
    <div className="grid w-full max-w-xs flex-none gap-4">
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>温馨提示</AlertTitle>
        <AlertDescription className="leading-normal">
          <p>
            使用微信扫描二维码后, 微信显示如左图
          </p>
          <p>
            说明
            {" "}
            {type}
            {" "}
            无法登录需要切换其他登录类型
          </p>
        </AlertDescription>
      </Alert>
    </div>
    <div className="size-[200px] flex-none justify-center">
      <img className="cursor-pointer" src={`${qrImgBase64}`} width={200} height={200} />
    </div>
    <div className="flex grow items-center">
      <h3>请在 <span className="font-mono font-semibold text-destructive">{seconds}</span> 秒倒计时结束前扫码</h3>
    </div>
  </>
)

const ScanedScreen = ({ avatar, name }: { avatar?: string, name?: string }) => (
  <>
    <img src={avatar} className="w-[150px]" />
    <h2>{name}</h2>
    <p>请在手机上点击确认以登录</p>
    <Loading text="正在验证登陆中，请稍后..." />
    <DialogClose asChild>
      <Button variant="destructive">
        取消登录
      </Button>
    </DialogClose>
  </>
)

const FormSchema = z.object({
  mode: z.enum(["captcha", "mac"], {
    required_error: "请选择一个",
  }),
  captchaCode: z.string().optional(),
}).refine((data) => {
  if (data.mode === "mac") return true
  return !!data.captchaCode && data.captchaCode.length === 6
}, {
  message: "验证码必须填写",
  path: ["captchaCode"],
})

export function ValidateScreen({ setCaptcha }: { setCaptcha: Dispatch<SetStateAction<string | undefined>> }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const { pid, form: req, qr, setQr, setForm } = useWechat()
  const loginMutation = useLoginMutation(pid)

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    if (data.mode === "mac" && req) {
      const data = { ...req, type: deviceTypeSchema.parse("mac") }
      return toast.promise(loginMutation.mutateAsync(data), {
        position: "top-center",
        loading: `正在获取二维码`,
        success: (qr: Qr) => {
          setForm(data)
          setQr(qr)
          return "获取二维码成功"
        },
        error: (error) => {
          const errorMessage = getFetchErrorMessage(error)
          return t(errorMessage)
        },
      })
    }
    if (data.mode === "captcha" && qr) {
      return setCaptcha(data.captchaCode)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={(v) => {
                    if (v === "mac") {
                      form.resetField("captchaCode")
                    }
                    field.onChange(v)
                  }}
                  defaultValue={field.value}
                  className="flex flex-col space-y-5"
                >
                  <FormItem className="flex items-start gap-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="captcha" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      手机显示验证码 (输入验证码)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-start gap-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="mac" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      手机显示在新设备完成验证（重新取码登录）
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("mode") === "captcha" && (
          <FormField
            control={form.control}
            name="captchaCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>验证码</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  请输入手机微信显示的验证码
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">确认</Button>
      </form>
    </Form>
  )
}
