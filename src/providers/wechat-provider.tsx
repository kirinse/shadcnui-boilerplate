import { createContext, useContext, useMemo, useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type { Qr, WechatForm } from "@/schema/wechat"

type DialogType = "wechat" | "qr"

interface WechatContextType {
  pid: string | null
  setPid: (str: string | null) => void
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  form: WechatForm | null
  setForm: React.Dispatch<React.SetStateAction<WechatForm | null>>
  qr: Qr | null
  setQr: React.Dispatch<React.SetStateAction<Qr | null>>
}

const WechatContext = createContext<WechatContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function WechatProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [form, setForm] = useState<WechatForm | null>(null)
  const [qr, setQr] = useState<Qr | null>(null)
  const [pid, setPid] = useState<string | null>(null)
  const providerValue = useMemo(() => {
    return {
      pid,
      setPid,
      open,
      setOpen,
      form,
      setForm,
      qr,
      setQr,
    }
  }, [open, setOpen, form, setForm, pid, setPid, qr, setQr])
  return (
    <WechatContext.Provider value={providerValue}>
      {children}
    </WechatContext.Provider>
  )
}

export const useWechat = () => {
  const wechatContext = useContext(WechatContext)

  if (!wechatContext) {
    throw new Error("useUsers has to be used within <WechatContext>")
  }

  return wechatContext
}
