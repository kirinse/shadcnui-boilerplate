import { CirclePlus } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PLACES, SEPARATOR } from "@/constants"
import type { LottoType } from "@/schema/message"

const DIGITS_RE_1 = new RegExp(`^(?:\\d[${SEPARATOR}]+)*\\d$`)
const DIGITS_RE_2 = new RegExp(`^(?:\\d[${SEPARATOR}]*)*\\d$`)

const init_numbers = () => Array.from({ length: 3 }, () => "")

export const Fixed = ({ onAdd, lottoState }: { onAdd: (i: string) => void, lottoState?: [LottoType[], Dispatch<SetStateAction<LottoType[]>>] }) => {
  const [numbers, setNumbers] = useState<Array<string>>(init_numbers)
  const [amount1, setAmount1] = useState(0)
  const [amount2, setAmount2] = useState(0)

  const onPlus = () => {
    if (numbers.filter((n) => n.trim()).length === 0) {
      return toast.error("请填写号码", { position: "top-center" })
    }
    if (!amount1 && !amount2) {
      return toast.error("请输入金额", { position: "top-center" })
    }
    if (amount1 && !numbers.every((n) => !n.trim() || DIGITS_RE_1.test(n.trim()))) {
      return toast.error("一码定位号码格式错误", { position: "top-center" })
    }
    if (amount2 && numbers.filter((n) => n.trim()).length !== 2) {
      return toast.error("同时填写 2 位上的号码", { position: "top-center" })
    }
    if (amount2 && !numbers.filter((n) => n.trim()).every((n) => DIGITS_RE_2.test(n.trim()))) {
      return toast.error("二码定位号码格式错误", { position: "top-center" })
    }

    let current_content = ""
    if (amount1) {
      current_content += lottoState?.[0].join("")
      current_content += "一码定位"
      numbers.forEach((n, i) => {
        if (n.trim()) {
          current_content += `${PLACES[i]}位${n}`
        }
      })
      current_content += `各${amount1 * 10}元`
    }
    if (amount2) {
      current_content += "\n"
      current_content += lottoState?.[0].join("")
      current_content += "二码定位"
      numbers.forEach((n, i) => {
        if (n.trim()) {
          current_content += `${PLACES[i]}位${n.trim().split(new RegExp(`[${SEPARATOR}]+`)).join("")}`
        }
      })
      current_content += `各${amount2 * 10}元`
    }
    onAdd(current_content)
    setNumbers(init_numbers)
    setAmount1(0)
    setAmount2(0)
    lottoState?.[1]([])
  }

  return (
    <div className="flex gap-2">
      <div className="flex grow flex-col gap-1">
        {PLACES.map((p, i) => {
          return (
            <FormItem key={`fixed1-${p}`} className="flex items-center gap-1 space-y-0">
              <FormLabel className="text-nowrap text-sm" htmlFor={`fixed1-${p}`}>
                {`${p}位`}
              </FormLabel>
              <Input
                id={`fixed1-${p}`}
                placeholder="输入号码"
                onChange={(e) => {
                  const old_numbers = [...numbers]
                  old_numbers.splice(i, 1, e.target.value)
                  setNumbers(old_numbers)
                }}
                value={numbers[i]}
              />
            </FormItem>
          )
        })}
      </div>
      <div className="flex w-28 flex-col items-center gap-1">
        <div className="relative flex items-center gap-1">
          <span className="text-nowrap text-sm">一码定位</span>
          <Input min={0} value={amount1 || ""} maxLength={4} className="w-full" type="number" onChange={(e) => { e.target.value.length <= 4 && setAmount1(Number.parseInt(e.target.value)) }} />
          <span className="absolute right-2 top-1/2 mt-px -translate-y-1/2 text-sm">0元</span>
        </div>
        <div className="relative flex items-center gap-1">
          <span className="text-nowrap text-sm">二码定位</span>
          <Input min={0} value={amount2 || ""} maxLength={4} className="w-full" type="number" onChange={(e) => { e.target.value.length <= 4 && setAmount2(Number.parseInt(e.target.value)) }} />
          <span className="absolute right-2 top-1/2 mt-px -translate-y-1/2 text-sm">0元</span>
        </div>
      </div>
      <Button type="button" onClick={onPlus} size="icon" variant="ghost" className="hover:bg-transparent" title="添加">
        <CirclePlus size={18} className="text-green-500" />
      </Button>
    </div>
  )
}
