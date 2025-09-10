import type { Dispatch, SetStateAction } from "react"

import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

export default function NumberInput({ state }: { state: [string, Dispatch<SetStateAction<string>>] }) {
  return (
    <FormItem className="flex grow space-y-0">
      <FormLabel className="sr-only">
        号码
      </FormLabel>
      <Textarea
        placeholder="输入号码"
        className="resize-none"
        onChange={(e) => {
          state[1](e.target.value)
        }}
        value={state[0]}
      />
      <FormMessage />
    </FormItem>
  )
}
