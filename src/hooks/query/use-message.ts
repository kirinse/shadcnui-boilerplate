import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query"
import type { PaginationState } from "@tanstack/react-table"

import { apiFetch } from "@/lib/api-fetch"
import type { MessageList } from "@/schema/message"

export function useMessages(pagination: PaginationState, day?: string) {
  const { data, isPending, isLoading } = useQuery({
    queryKey: ["messages", pagination.pageIndex, pagination.pageSize, day],
    queryFn: async () => apiFetch<MessageList>("/api/messages", {
      params: {
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        day,
      },
    }),
    placeholderData: keepPreviousData,
  })

  return {
    isPending,
    isLoading,
    data: {
      list: data?.results || [],
      total_pages: data?.pagination.total_pages || 0,
      page: data?.pagination.page || 0,
      page_size: data?.pagination.page_size || 0,
    },
  }
}
