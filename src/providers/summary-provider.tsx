import { createContext, useContext, useMemo, useState } from "react"

import { useRisk2, useSummary } from "@/hooks/query/use-number"
import type { IRisk, ISummary } from "@/schema/number"
import type { LottoType } from "@/schema/wechat"

import { useAuth } from "./auth-provider"

interface SummaryContextType {
  lotto: LottoType
  setLotto: React.Dispatch<React.SetStateAction<LottoType>>
  day: Date
  setDay: React.Dispatch<React.SetStateAction<Date>>
  risk?: [string, IRisk[]][]
  refetchRisk: () => void
  summary?: ISummary
  riskEnabled: boolean
  setRiskEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

const SummaryContext = createContext<SummaryContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function SummaryProvider({ children }: Props) {
  const [lotto, setLotto] = useState<LottoType>("福")
  const [day, setDay] = useState(() => new Date())
  const [riskEnabled, setRiskEnabled] = useState(false)
  const { user } = useAuth()

  const { data: risk, refetch: refetchRisk } = useRisk2(lotto, riskEnabled)
  const { data: summary } = useSummary(day, user?.id ? [user.id] : undefined)
  const providerValue = useMemo(() => {
    return {
      lotto,
      setLotto,
      day,
      setDay,
      risk,
      refetchRisk,
      summary,
      riskEnabled,
      setRiskEnabled,
    }
  }, [lotto, day, risk, refetchRisk, summary, riskEnabled])
  return (
    <SummaryContext.Provider value={providerValue}>
      {children}
    </SummaryContext.Provider>
  )
}

export const useSummaryCtx = () => {
  const summaryContext = useContext(SummaryContext)

  if (!summaryContext) {
    throw new Error("useSummaryCtx has to be used within <SummaryContext>")
  }

  return summaryContext
}
