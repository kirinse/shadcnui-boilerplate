import type { Dispatch, SetStateAction } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormLabel } from "@/components/ui/form"
import type { LottoType } from "@/schema/message"
import { lottoType } from "@/schema/message"

export function Lotto({ lotto, setLotto }: { lotto: LottoType[], setLotto: Dispatch<SetStateAction<LottoType[]>> }) {
  return (
    <FormItem className="flex flex-row space-x-2 space-y-0">
      {lottoType.map((item) => (
        <FormField
          key={item}
          name="lotto"
          render={() => {
            return (
              <FormItem
                key={item}
                className="flex flex-row items-center gap-1 space-y-0"
              >
                <Checkbox
                  id={`lotto-${item}`}
                  checked={lotto.includes(item)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setLotto([...lotto, item])
                    } else {
                      const v = lotto.filter(
                        (value) => value !== item,
                      )
                      setLotto(v)
                    }
                  }}
                />
                <FormLabel htmlFor={`lotto-${item}`} className="cursor-pointer text-sm font-normal">
                  {`${item}`}
                </FormLabel>
              </FormItem>
            )
          }}
        />
      ))}
    </FormItem>
  )
}
