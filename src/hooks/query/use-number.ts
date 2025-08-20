import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { groupBy, reverse } from "lodash-es"

import { apiFetch } from "@/lib/api-fetch"
import type { INumber, INumberDetails, IRisk, ISummary } from "@/schema/number"

export function useNumbers(lotto = "福", day = new Date(), refetchInterval?: any, number?: string, userId?: number) {
  return useQuery({
    queryKey: ["numbers", lotto, day, number, userId],
    queryFn: async () => apiFetch<{ total: number, numbers: INumber[] }>("/api/numbers", {
      params: {
        lotto,
        day: format(day, "yyyy-MM-dd"),
        number,
        user_id: userId,
      },
    }),
    refetchInterval,
    refetchIntervalInBackground: true,
    staleTime: 1000,
  })
}

export function useSummary(day = new Date(), userId?: number[]) {
  return useQuery({
    queryKey: ["summary", day, userId],
    queryFn: async () => apiFetch<ISummary>("/api/summary", {
      params: {
        day: format(day, "yyyy-MM-dd"),
        user_id: userId,
      },
    }),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  })
}

export function useRisk(lotto = "福", day = new Date(), number?: any, userId?: number) {
  return useQuery({
    queryKey: ["risk", lotto, day, number, userId],
    queryFn: async () => {
      const data = await apiFetch<IRisk[]>("/api/risk", {
        params: {
          lotto,
          day: format(day, "yyyy-MM-dd"),
          number,
          user_id: userId,
        },
      })
      return reverse(Object.entries(groupBy(data.map((r) => { return { ...r, bets: Math.ceil(r.prize / 1800) } }), (d) => d.bets)))
    },
    refetchOnWindowFocus: false,
    enabled: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    staleTime: 500,
  })
}

export function useRisk2(lotto = "福", enabled = false) {
  return useQuery({
    queryKey: ["risk2", lotto],
    queryFn: async () => apiFetch<IRisk[]>("/api/risk", {
      params: {
        lotto,
        day: format(new Date(), "yyyy-MM-dd"),
      },
    }).then((res) => {
      return reverse(Object.entries(groupBy(res.map((r) => { return { ...r, bets: Math.ceil(r.prize / 1800) } }), (d) => d.bets)))
    }),
    refetchInterval: 5000,
    enabled,
  })
}

export function useNumberDetails(lotto = "福", day = new Date(), number: string, userId?: number) {
  return useQuery({
    queryKey: ["numberDetails", lotto, day, number, userId],
    queryFn: async () => apiFetch<INumberDetails[]>(`/api/numbers/${lotto}/${format(day, "yyyy-MM-dd")}/${number}`, {
      params: {
        user_id: userId,
      },
    }),
    refetchOnWindowFocus: false,
    enabled: number !== "",
    refetchOnReconnect: false,
    retryOnMount: false,
    staleTime: 500,
  })
}

export function useNowSummary(userId?: number) {
  return useQuery({
    queryKey: ["now-summary", userId],
    queryFn: async () => apiFetch<ISummary>("/api/summary", {
      params: {
        day: format(new Date(), "yyyy-MM-dd"),
        user_id: userId,
      },
    }),
    // refetchInterval: 10000,
    // refetchIntervalInBackground: true,
    // refetchOnWindowFocus: true,
  })
}
