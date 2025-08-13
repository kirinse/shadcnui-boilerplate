import { createContext, useContext, useMemo, useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type { IUser } from "@/schema/user"

type UsersDialogType = "invite" | "add" | "edit" | "delete" | "wechat" | "qr"

interface UsersContextType {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: IUser | null
  setCurrentRow: React.Dispatch<React.SetStateAction<IUser | null>>
}

const UsersContext = createContext<UsersContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function UsersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<IUser | null>(null)
  const providerValue = useMemo(() => {
    return {
      open,
      setOpen,
      currentRow,
      setCurrentRow,
    }
  }, [open, setOpen, currentRow, setCurrentRow])
  return (
    <UsersContext.Provider value={providerValue}>
      {children}
    </UsersContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = useContext(UsersContext)

  if (!usersContext) {
    throw new Error("useUsers has to be used within <UsersContext>")
  }

  return usersContext
}
