import { createContext, useContext, useMemo, useState } from "react"

import { useRisk2 } from "@/hooks/query/use-number"
import type { IRisk } from "@/schema/number"
import type { LottoType } from "@/schema/wechat"

interface SummaryContextType {
  lotto: LottoType
  setLotto: React.Dispatch<React.SetStateAction<LottoType>>
  risk?: [string, IRisk[]][]
  refetchRisk: () => void
  riskEnabled: boolean
  setRiskEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

const SummaryContext = createContext<SummaryContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function SummaryProvider({ children }: Props) {
  const [lotto, setLotto] = useState<LottoType>("福")
  const [riskEnabled, setRiskEnabled] = useState(false)

  const { data: risk, refetch: refetchRisk } = useRisk2(lotto, riskEnabled)
  const providerValue = useMemo(() => {
    return {
      lotto,
      setLotto,
      risk,
      refetchRisk,
      riskEnabled,
      setRiskEnabled,
    }
  }, [lotto, risk, refetchRisk, riskEnabled])
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
