import { createContext, useContext, useMemo } from "react"

import { useUser } from "@/hooks/query/use-user"
import type { IUser } from "@/schema/user"

type AuthProviderProps = {
  children: React.ReactNode
}

type AuthProviderState = {
  user: IUser
}

const AuthProviderContext = createContext<AuthProviderState | undefined>(undefined)

export function AuthProvider({
  children,
  ...props
}: AuthProviderProps) {
  const { data: user } = useUser()

  const providerValue = useMemo(() => {
    return {
      user,
    }
  }, [user])

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
