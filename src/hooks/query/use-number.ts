import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { apiFetch } from "@/lib/api-fetch"
import type { INumber, INumberDetails, IRisk } from "@/schema/number"

export function useNumbers(lotto = "福", day = new Date(), refetchInterval?: any, number?: string) {
  return useQuery({
    queryKey: ["numbers", lotto, day, number],
    queryFn: async () => apiFetch<{ total: number, numbers: INumber[] }>("/api/numbers", {
      params: {
        lotto,
        day: format(day, "yyyy-MM-dd"),
        number,
      },
    }),
    refetchInterval,
    refetchIntervalInBackground: true,
    staleTime: 1000,
  })
}

export function useRisk(lotto = "福", day = new Date(), number?: any) {
  return useQuery({
    queryKey: ["risk", lotto, day, number],
    queryFn: async () => apiFetch<IRisk[]>("/api/risk", {
      params: {
        lotto,
        day: format(day, "yyyy-MM-dd"),
        number,
      },
    }),
    refetchOnWindowFocus: false,
    enabled: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    staleTime: 500,
  })
}

export function useNumberDetails(lotto = "福", day = new Date(), number: string) {
  return useQuery({
    queryKey: ["numberDetails", lotto, day, number],
    queryFn: async () => apiFetch<INumberDetails[]>(`/api/numbers/${lotto}/${format(day, "yyyy-MM-dd")}/${number}`),
    refetchOnWindowFocus: false,
    enabled: number !== "",
    refetchOnReconnect: false,
    retryOnMount: false,
    staleTime: 500,
  })
}
