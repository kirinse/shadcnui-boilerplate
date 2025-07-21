import {
  keepPreviousData,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import type { PaginationState } from "@tanstack/react-table"

import { apiFetch } from "@/lib/api-fetch"
import type { MessageList, MessageStatus } from "@/schema/message"

export function useMessages(pagination: PaginationState, day?: string, lotto?: string, method?: string, number?: string, user_id?: number, status?: MessageStatus, refetchInterval?: any) {
  const { data, isFetching, isRefetching, refetch } = useQuery({
    queryKey: ["messages", pagination.pageIndex, pagination.pageSize, day, lotto, method, number, user_id, status],
    queryFn: async () => apiFetch<MessageList>("/api/messages", {
      params: {
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        day,
        lotto,
        method,
        search: number,
        user_id,
        status,
      },
    }),
    placeholderData: keepPreviousData,
    refetchInterval,
  })

  return {
    isFetching,
    isRefetching,
    refetch,
    data: {
      list: data?.results || [],
      total_pages: data?.pagination.total_pages || 0,
      page: data?.pagination.page || 0,
      page_size: data?.pagination.page_size || 0,
      summary: data?.summary,
    },
  }
}

export function useMessageDeletionMutation() {
  return useMutation({
    mutationFn: async (id: number) =>
      await apiFetch(`/api/messages/${id}`, {
        method: "DELETE",
      }),
    mutationKey: ["message-delete"],
  })
}
