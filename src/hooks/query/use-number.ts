import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { apiFetch } from "@/lib/api-fetch"
import type { INumber, IRisk } from "@/schema/number"

export function useNumbers(lotto = "体", day = new Date(), refetchInterval?: any) {
  return useQuery({
    queryKey: ["numbers", lotto, day],
    queryFn: async () => apiFetch<INumber[]>("/api/numbers", {
      params: {
        lotto,
        day: format(day, "yyyy-MM-dd"),
      },
    }),
    refetchInterval,
  })
}

export function useRisk(lotto = "福", day = new Date()) {
  return useQuery({
    queryKey: ["risk", lotto, day],
    queryFn: async () => apiFetch<IRisk[]>("/api/risk", {
      params: {
        lotto,
        day: format(day, "yyyy-MM-dd"),
      },
    }),
    refetchOnWindowFocus: false,
    enabled: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    staleTime: 500,
  })
}
