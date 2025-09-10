import { createContext, useContext, useMemo, useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type { Message } from "@/schema/message"

type MessagesDialogType = "add" | "edit" | "delete"
export type Msg = Omit<Message, "orders">

interface MessagesContextType {
  open: MessagesDialogType | null
  setOpen: (str: MessagesDialogType | null) => void
  currentRow: Message | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Message | null>>
}

const MessagesContext = createContext<MessagesContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function MessagesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<MessagesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Message | null>(null)
  const providerValue = useMemo(() => {
    return {
      open,
      setOpen,
      currentRow,
      setCurrentRow,
    }
  }, [open, setOpen, currentRow, setCurrentRow])
  return (
    <MessagesContext.Provider value={providerValue}>
      {children}
    </MessagesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMessages = () => {
  const messagesContext = useContext(MessagesContext)

  if (!messagesContext) {
    throw new Error("useUsers has to be used within <MessagesContext>")
  }

  return messagesContext
}
