import { createContext, useContext, useState } from "react"

type AuthProviderProps = {
  children: React.ReactNode
  storageKey?: string
}

type AuthProviderState = {
  token: string
  setToken: (token: string) => void
}

const initialState: AuthProviderState = {
  token: "",
  setToken: () => null,
}

const AuthProviderContext = createContext<AuthProviderState>(initialState)

export function AuthProvider({
  children,
  storageKey = "token",
  ...props
}: AuthProviderProps) {
  const [token, setToken] = useState<string>(
    () => (localStorage.getItem(storageKey) as string) || "",
  )

  // eslint-disable-next-line @eslint-react/no-unstable-context-value
  const value = {
    token,
    setToken: (token: string) => {
      localStorage.setItem(storageKey, token)
      setToken(token)
    },
  }

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext)

  if (context === undefined) { throw new Error("useAuth must be used within a AuthProvider") }

  return context
}
