"use client"

import { t } from "i18next"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLogoutMutation } from "@/hooks/query/use-wechat"
import { getFetchErrorMessage } from "@/lib/api-fetch"
import { useWechat } from "@/providers/wechat-provider"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersWechatLogoutDialog({ open, onOpenChange }: Props) {
  const logoutMutation = useLogoutMutation("list")
  const { pid, form, setForm, setPid } = useWechat()

  const handleLogout = () => {
    onOpenChange(false)
    toast.promise(logoutMutation.mutateAsync({ user_pid: pid!, app_id: form!.appId }), {
      position: "top-center",
      loading: `正在登出微信`,
      success: () => {
        setForm(null)
        setPid(null)
        return "登出成功"
      },
      error: (error) => {
        const errorMessage = getFetchErrorMessage(error)
        return t(errorMessage)
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleLogout}
      disabled={logoutMutation.isPending}
      isLoading={logoutMutation.isPending}
      title={(
        <span className="text-destructive">
          <AlertTriangle
            className="mr-1 inline-block stroke-destructive"
            size={18}
          />
          {" "}
          退出微信
        </span>
      )}
      desc={(
        <div className="space-y-4">
          <p className="mb-2">
            你确认要登出微信
            {" "}
            {/* <span className="font-bold">{form}</span> */}
            ?
          </p>
          <Alert variant="destructive">
            <AlertTitle>警告!</AlertTitle>
            <AlertDescription>
              退出微信后将不再同步该微信账号消息
            </AlertDescription>
          </Alert>
        </div>
      )}
      confirmText="退出"
      cancelBtnText="取消"
      destructive
    />
  )
}
