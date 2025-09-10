import { CirclePlus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SEPARATOR } from "@/constants"
import { noDuplicated } from "@/lib/utils"
import type { LottoType } from "@/schema/message"

import { Fixed } from "./fixed"
import { Lotto } from "./lotto"
import NumberInput from "./number"

const DIGITS_3_RE = new RegExp(`^(?:\\d{3}[${SEPARATOR}]+)*\\d{3}$`)
const DIGITS_4__RE = new RegExp(`^(?:\\d{4,9}[${SEPARATOR}]+)*\\d{4,9}$`)
const UNFIXED1_RE = new RegExp(`^(?:\\d[${SEPARATOR}]+)*\\d$`)
const UNFIXED2_RE = new RegExp(`^(?:\\d{2}[${SEPARATOR}]+)*\\d{2}$`)

export const InputNumber = ({ onAdd }: { onAdd: (i: string) => void }) => {
  const [lotto, setLotto] = useState<LottoType[]>([])
  const [numbers, setNumbers] = useState("")
  // 直、组、复
  const [straights, setStraights] = useState(0)
  const [combos, setCombos] = useState(0)
  const [duplex, setDuplex] = useState(0)
  // 组三、六
  const [combo3, setCombo3] = useState(0)
  const [combo6, setCombo6] = useState(0)
  // 独胆、双飞
  const [unfixed1, setUnfixed1] = useState(0)
  const [unfixed2, setUnfixed2] = useState(0)

  const onPlus = () => {
    if (!numbers.trim()) {
      return toast.error("请填写号码", { position: "top-center" })
    }
    if ((straights || combos || duplex) && !DIGITS_3_RE.test(numbers.trim())) {
      return toast.error("直、组、复号码格式错误", { position: "top-center" })
    }
    if ((combo3 || combo6)) {
      if (!DIGITS_4__RE.test(numbers.trim())) {
        return toast.error("组三、组六号码格式错误", { position: "top-center" })
      }
      if (!numbers.trim().split(new RegExp(`[${SEPARATOR}]+`)).every((n) => noDuplicated(n))) {
        return toast.error("组三、组六号码数字不能重复", { position: "top-center" })
      }
    }
    if (unfixed1 && !UNFIXED1_RE.test(numbers.trim())) {
      return toast.error("独胆号码格式错误", { position: "top-center" })
    }
    // if (!numbers.trim().split(new RegExp(`[${SEPARATOR}]+`)).every((n) => noDuplicated(n))) {
    //     return toast.error("独胆号码数字不能重复", { position: "top-center" })
    // }
    if (unfixed2 && !UNFIXED2_RE.test(numbers.trim())) {
      return toast.error("双飞号码格式错误", { position: "top-center" })
    }

    let current_content = ""
    if (straights || combos || duplex) {
      current_content = lotto.join("")
      current_content += " "
      current_content += numbers
      current_content += " "

      if (straights) {
        current_content += `${straights}单`
      }
      if (combos) {
        current_content += `${combos}组`
      }
      if (duplex) {
        current_content += `${straights || combos ? "➕" : ""}${duplex}复`
      }
      current_content += "\n"
    }

    if (combo3 || combo6) {
      current_content += lotto.join("")
      current_content += " "
      current_content += numbers
      if (combo3) {
        current_content += `组三${combo3 * 10}元`
      }
      if (combo6) {
        current_content += `组六${combo6 * 10}元`
      }
      current_content += "\n"
    }

    if (unfixed1) {
      current_content += lotto.join("")
      current_content += " "
      current_content += numbers
      current_content += `独胆${unfixed1 * 10}元`
      current_content += "\n"
    }
    if (unfixed2) {
      current_content += lotto.join("")
      current_content += " "
      current_content += numbers
      current_content += `双飞${unfixed2 * 10}元`
      current_content += "\n"
    }

    onAdd(current_content.trim())
    setNumbers("")
    setStraights(0)
    setCombos(0)
    setDuplex(0)
    setCombo3(0)
    setCombo6(0)
    setUnfixed1(0)
    setUnfixed2(0)
    setLotto([])
  }

  return (
    <>
      <Lotto lotto={lotto} setLotto={setLotto} />
      <div className="flex gap-2">
        <NumberInput state={[numbers, setNumbers]} />
        <div className="flex flex-col gap-2">
          <div className="grid w-28 grid-cols-2 flex-col items-center gap-1">
            <div className="relative flex items-center gap-1">
              <Input min={0} value={straights || ""} className="min-w-10 px-2" type="number" onChange={(e) => { setStraights(Number.parseInt(e.target.value)) }} />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">单</span>
            </div>
            <div className="relative flex items-center gap-1">
              <Input min={0} value={combos || ""} className="min-w-10 px-2" type="number" onChange={(e) => { setCombos(Number.parseInt(e.target.value)) }} />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">组</span>
            </div>
            <div className="relative flex items-center gap-1">
              <Input min={0} value={duplex || ""} className="min-w-10 px-2" type="number" onChange={(e) => { setDuplex(Number.parseInt(e.target.value)) }} />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm">复</span>
            </div>
          </div>
          <div className="flex w-28 flex-col items-center gap-1">
            <div className="relative flex items-center gap-1">
              <span className="text-nowrap text-sm">组三</span>
              <Input min={0} value={combo3 || ""} maxLength={4} className="w-full" type="number" onChange={(e) => { e.target.value.length <= 4 && setCombo3(Number.parseInt(e.target.value)) }} />
              <span className="absolute right-2 top-1/2 mt-px -translate-y-1/2 text-sm">0元</span>
            </div>
            <div className="relative flex items-center gap-1">
              <span className="text-nowrap text-sm">组六</span>
              <Input min={0} value={combo6 || ""} maxLength={4} className="w-full" type="number" onChange={(e) => { e.target.value.length <= 4 && setCombo6(Number.parseInt(e.target.value)) }} />
              <span className="absolute right-2 top-1/2 mt-px -translate-y-1/2 text-sm">0元</span>
            </div>
          </div>
          <div className="flex w-28 flex-col items-center gap-1">
            <div className="relative flex items-center gap-1">
              <span className="text-nowrap text-sm">独胆</span>
              <Input min={0} value={unfixed1 || ""} maxLength={4} className="w-full" type="number" onChange={(e) => { e.target.value.length <= 4 && setUnfixed1(Number.parseInt(e.target.value)) }} />
              <span className="absolute right-2 top-1/2 mt-px -translate-y-1/2 text-sm">0元</span>
            </div>
          </div>
          <div className="flex w-28 flex-col items-center gap-1">
            <div className="relative flex items-center gap-1">
              <span className="text-nowrap text-sm">双飞</span>
              <Input min={0} value={unfixed2 || ""} maxLength={4} className="w-full" type="number" onChange={(e) => { e.target.value.length <= 4 && setUnfixed2(Number.parseInt(e.target.value)) }} />
              <span className="absolute right-2 top-1/2 mt-px -translate-y-1/2 text-sm">0元</span>
            </div>
          </div>
        </div>
        <Button
          type="button"
          onClick={onPlus}
          size="icon"
          variant="ghost"
          className="hover:bg-transparent"
          title="保存"
        >
          <CirclePlus size={18} className="text-green-500" />
        </Button>
      </div>
      <Separator decorative className="h-px w-full" />
      <Fixed onAdd={onAdd} lottoState={[lotto, setLotto]} />
    </>
  )
}
