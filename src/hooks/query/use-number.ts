import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { apiFetch } from "@/lib/api-fetch"
import type { INumber } from "@/schema/number"

export function useNumbers(lotto = "体", day = new Date()) {
  return useQuery({
    queryKey: ["numbers", lotto, day],
    queryFn: async () => apiFetch<INumber[]>("/api/numbers", {
      params: {
        lotto,
        day: format(day, "yyyy-MM-dd"),
      },
    }),
  })
}
