import { AlertCircleIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
import { useWechat } from "@/providers/wechat-provider"
import type { CheckResp, DeviceType, Qr } from "@/schema/wechat"

import { Loading } from "./loading"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
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

  useEffect(() => {
    let intervalId: any
    if (open && !!qr) {
      intervalId = setInterval(() => {
        setCountdown((prevCount: number) => {
          // 倒计时未结束
          if (prevCount > 0) {
            // 检查登录状态
            if (prevCount % CHECK_INTERVAL === 0) {
              checkMutation.mutateAsync({
                appId: qr.appId,
                proxyIp: form?.proxyIp,
                uuid: qr.uuid,
              }, {
                onSuccess: (data) => {
                  if ("status" in data && data.status === 2) {
                    setOpen(null)
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
      clearInterval(intervalId)
    }
  }, [open, form, loginMutation, qr, setQr, checkMutation, setOpen])
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
          <div className="flex grow flex-col items-center gap-2">
            {(!result || "code" in result || result?.status === 0) && <QrScreen qrImgBase64={qr?.qrImgBase64} seconds={countdown} type={form?.type} />}
            {!!result && "status" in result && result?.status === 1 && <ScanedScreen avatar={result?.headImgUrl} name={result?.nickName} />}
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

export const ConfirmScreen = () => (
  <RadioGroup name="confirmMethod" defaultValue="comfortable">
    <div className="flex items-center gap-3">
      <RadioGroupItem value="1" id="r1" />
      <Label htmlFor="r1">手机显示验证码 (输入验证码)</Label>
    </div>
    <div className="flex items-center gap-3">
      <RadioGroupItem value="2" id="r2" />
      <Label htmlFor="r2">手机显示在新设备完成验证（重新取码登录）</Label>
    </div>
  </RadioGroup>
)

export const CaptchaScreen = () => (
  <></>
)
