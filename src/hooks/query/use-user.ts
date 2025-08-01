import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import type { PaginationState } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"

import { apiFetch } from "@/lib/api-fetch"
import type { ILoginForm, IUserProfile, IUsers } from "@/schema/user"

export const queryUser = () => queryOptions({
  queryKey: ["userInfo"],
  queryFn: async () => apiFetch<IUserProfile>("/api/auth/current"),
})

export const queryUserInfo = () =>
  queryOptions({
    queryKey: ["user-info"],
    queryFn: async () => apiFetch<IUsers>(`/api/auth/current`),
  })

export function useUser() {
  return useSuspenseQuery(queryUserInfo())
}

export function useUserLoginMutation() {
  return useMutation({
    mutationFn: async (loginForm: ILoginForm) =>
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: loginForm,
      }),
    mutationKey: ["user-login"],
  })
}

export function useUserLogoutMutation() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async () => await apiFetch("/api/auth/logout"),
    mutationKey: ["user-logout"],
    onSuccess: () => {
      localStorage.clear()
      navigate("/login")
    },
  })
}

export function useUsers(pagination: PaginationState) {
  const { data, isPending, refetch: fetch } = useQuery({
    queryKey: ["users", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => apiFetch<IUsers[]>("/api/users", {
      params: {
        page: pagination.pageIndex,
        page_size: pagination.pageSize,
      },
    }),
    placeholderData: keepPreviousData,
    enabled: false,
  })
  return {
    isPending,
    data,
    fetch,
  }
}
