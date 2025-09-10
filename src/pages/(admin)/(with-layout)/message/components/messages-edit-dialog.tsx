"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { RowSelectionState } from "@tanstack/react-table"
import { t } from "i18next"
import { SquareX } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea"
import { useMessageCorrectionMutation } from "@/hooks/query/use-message"
import { getFetchErrorMessage } from "@/lib/api-fetch"
import type { Message, MessageForm } from "@/schema/message"
import { formSchema } from "@/schema/message"

import { orderFormat } from "../utils"
import { InputNumber } from "./inputers"
import { OrderTable } from "./order-table"
import { order_columns } from "./order-table-columns"

interface Props {
  currentRow: Message
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MessagesEditDialog({ currentRow, open, onOpenChange }: Props) {
  const [inputted, setInputted] = useState<string[]>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const content = useMemo(() => Object.keys(rowSelection).map((k) => Number.parseInt(k)).map((k) => orderFormat(currentRow.orders[k]!)).concat(inputted).join("\n"), [currentRow.orders, inputted, rowSelection])

  const form = useForm<MessageForm>({
    resolver: zodResolver(formSchema),
    values:
    {
      id: currentRow.id,
      content,
    },
  })

  const correctionMutation = useMessageCorrectionMutation()

  const successMsg = "消息纠错提交成功"

  function onSubmit(values: MessageForm) {
    // return console.log(values)

    toast.promise(correctionMutation.mutateAsync(values), {
      position: "top-center",
      loading: "提交中...",
      success: () => {
        form.reset()
        onOpenChange(false)
        return successMsg
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
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent
        className="max-h-screen overflow-y-auto sm:my-auto sm:max-w-5xl sm:gap-0"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="grow-0 text-left">
          <DialogTitle>编辑消息</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="w-full py-2">
          <Form {...form}>
            <form
              id="message-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 lg:max-w-5xl lg:grid-cols-2 lg:gap-2"
            >
              <div className="relative col-start-1 row-start-2 flex flex-col justify-start gap-2 rounded-lg p-3 sm:p-0 lg:row-start-1">
                <InputNumber onAdd={(i) => setInputted(inputted.concat(i))} />
              </div>
              <div className="flex flex-col gap-2 md:mb-2">
                <div className="whitespace-pre-wrap break-all rounded-sm bg-gray-200/50 p-2 font-mono">{currentRow?.content}</div>
                {currentRow?.orders.length > 0 && (
                  <OrderTable
                    columns={order_columns.filter((c) => ["select", "lotto", "method", "numbers", "times", "price"].includes(c.id!))}
                    data={currentRow?.orders}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                {inputted.map((i, idx) => (
                  // eslint-disable-next-line @eslint-react/no-array-index-key
                  <div key={`inputted-${idx}`} className="relative whitespace-pre-wrap break-all rounded-sm border px-4 py-2 font-mono text-xs">
                    {i}
                    <Button type="button" size="icon" className="absolute right-0 top-0 h-full w-8 rounded-sm bg-transparent text-muted-foreground opacity-70 ring-offset-background transition-opacity hover:bg-transparent hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none" variant="link" onClick={() => setInputted(inputted.filter((_, i_) => i_ !== idx))}>
                      <SquareX size={14} />
                    </Button>
                  </div>
                ))}
              </div>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="px-px">
                    <FormLabel>
                      消息内容
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        readOnly
                      // rows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="grow-0 gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button type="submit" form="message-form" disabled={correctionMutation.isPending}>
            {correctionMutation.isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
