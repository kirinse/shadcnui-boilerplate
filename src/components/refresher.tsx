import type { SelectProps } from "@radix-ui/react-select"

import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function Refresher(
  { onValueChange }: Partial<SelectProps>,
) {
  return (
    <div className="inline-flex items-center space-x-2">
      <Label htmlFor="refresher" className="hidden font-normal sm:flex">
        <span>自动刷新</span>
      </Label>
      <Select defaultValue="off" onValueChange={onValueChange}>
        <SelectTrigger id="refresher" className="ml-auto w-auto" aria-label="Refresh">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="off">关闭</SelectItem>
          <SelectItem value="30000">30 秒</SelectItem>
          <SelectItem value="60000">1 分钟</SelectItem>
          <SelectItem value="90000">90 秒</SelectItem>
          <SelectItem value="300000">5 分钟</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
