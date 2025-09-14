import type { Row } from "@tanstack/react-table"
import { useAtom } from "jotai"
import { SquarePen, Trash } from "lucide-react"
import { useMemo } from "react"

import { authTokenAtom } from "@/atoms/auth"
import { Button } from "@/components/ui/button"
import { useNow } from "@/hooks/use-now"
import type { Message } from "@/schema/message"

import { useMessages } from "../context/messages-context"

// const RE = /\d+|[豹对]/

interface DataTableRowActionsProps {
  row: Row<Message>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useMessages()
  const now = useNow(1, "date")
  const today = now.toLocaleDateString("zh-CN")
  const yesterday = useMemo(() => {
    return new Date(new Date().setDate(now.getDate() - 1)).toLocaleDateString("zh-CN")
  }, [now])
  // console.log(today, yesterday)
  const [authToken, _] = useAtom(authTokenAtom)

  const canDelete = useMemo(() => !["Warning", "Deleted", "Revoked", "Failed"].includes(row.original.status) &&
    [today, yesterday].includes(new Date(row.original.ts * 1000).toLocaleDateString("zh-CN")) &&
    authToken.is_admin, [authToken.is_admin, row, today, yesterday])
  const canEdit = useMemo(() => ["Warning", "Failed"].includes(row.original.status) &&
    [today].includes(new Date(row.original.ts * 1000).toLocaleDateString("zh-CN")), [row, today])

  return (
    <div className="flex justify-center">
      {canDelete && (
        <Button
          size="icon"
          variant="link"
          title="删除"
          className="group"
          onClick={() => {
            setCurrentRow(row.original)
            setOpen("delete")
          }}
        >
          <Trash size={16} className="text-destructive group-disabled:text-slate-400" />
          <span className="sr-only">删除</span>
        </Button>
      )}
      {canEdit && (
        <Button
          size="icon"
          variant="link"
          title="纠错"
          className="group"
          onClick={() => {
            setCurrentRow(row.original)
            setOpen("edit")
          }}
        >
          <SquarePen size={16} className="text-blue-500 group-disabled:text-slate-400" />
          <span className="sr-only">纠错</span>
        </Button>
      )}
    </div>
  )
}
