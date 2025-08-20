import { createContext, useContext, useMemo, useState } from "react"

import type { IUser } from "@/schema/user"

type AuthProviderProps = {
  children: React.ReactNode
  current?: IUser
}

type AuthProviderState = {
  user?: IUser
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>
}

const AuthProviderContext = createContext<AuthProviderState | undefined>(undefined)

export function AuthProvider({
  children,
  current,
  ...props
}: AuthProviderProps) {
  const [user, setUser] = useState<IUser | undefined>(current)

  const providerValue = useMemo(() => {
    return {
      user,
      setUser,
    }
  }, [user, setUser])

  return (
    <AuthProviderContext.Provider {...props} value={providerValue}>
      {children}
    </AuthProviderContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext)

  if (context === undefined) { throw new Error("useAuth must be used within a AuthProvider") }

  return context
}
