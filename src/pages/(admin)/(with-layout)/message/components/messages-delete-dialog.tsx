"use client"

import { t } from "i18next"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMessageDeletionMutation } from "@/hooks/query/use-message"
import { getFetchErrorMessage } from "@/lib/api-fetch"
import type { Message } from "@/schema/message"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Message
}

export function MessagesDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState("")
  const deletionMutation = useMessageDeletionMutation()

  async function onDelete(id: bigint) {
    toast.promise(deletionMutation.mutateAsync(id), {
      position: "top-center",
      loading: "删除中...",
      success: () => {
        return "删除成功"
      },
      error: (error) => {
        const errorMessage = getFetchErrorMessage(error)
        return t(errorMessage)
      },
    })
  }

  const handleDelete = () => {
    if (value.trim() !== currentRow.id.toString()) return
    onDelete(currentRow.id)
    onOpenChange(false)
    // console.log(currentRow, "The following user has been deleted:")
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.id.toString()}
      title={(
        <span className="text-destructive">
          <AlertTriangle
            className="mr-1 inline-block stroke-destructive"
            size={18}
          />
          {" "}
          删除消息
        </span>
      )}
      desc={(
        <div className="space-y-4">
          <p className="mb-2">
            你确认要删除消息
            {" "}
            <span className="font-bold">{currentRow.id.toString()}</span>
            {" "}
            吗？
            <br />
            这个操作将永久从系统内删除，不可恢复。
          </p>

          <Label className="my-2">
            ID:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="输入消息ID确认"
            />
          </Label>
        </div>
      )}
      confirmText="删除"
      cancelBtnText="取消"
      destructive
    />
  )
}
