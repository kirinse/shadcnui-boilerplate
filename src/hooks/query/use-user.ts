import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import type { PaginationState } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"

import { apiFetch } from "@/lib/api-fetch"
import type { ILoginForm, IUser, IUserList, IUserProfile, UserForm } from "@/schema/user"

export const queryUser = () => queryOptions({
  queryKey: ["userInfo"],
  queryFn: async () => apiFetch<IUserProfile>("/api/auth/current"),
})

export const queryUserInfo = () =>
  queryOptions({
    queryKey: ["user-info"],
    queryFn: async () => apiFetch<IUser>(`/api/auth/current`),
  })

export function useUser() {
  return useSuspenseQuery(queryUserInfo())
}

export function useUserLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (loginForm: ILoginForm) =>
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: loginForm,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-info"] })
    },
    mutationKey: ["user-login"],
  })
}

export function useUserLogoutMutation(setAuthTokenAtom: any) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async () => await apiFetch("/api/auth/logout"),
    mutationKey: ["user-logout"],
    onSuccess: () => {
      setAuthTokenAtom({})
      queryClient.invalidateQueries({ queryKey: ["user-info"] })
      navigate("/login")
    },
  })
}

export function useUsers(pagination: PaginationState, enabled = false) {
  const { data, isPending, refetch: fetch } = useQuery({
    queryKey: ["users", pagination],
    queryFn: async () => apiFetch<IUserList>("/api/users", {
      params: {
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
      },
    }),
    placeholderData: keepPreviousData,
    enabled,
  })
  return {
    isPending,
    data,
    fetch,
  }
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: UserForm) =>
      await apiFetch(`/api/users/${user.id}`, {
        method: "PATCH",
        body: user,
      }),
    onSuccess: () => {
      // 更新用户列表缓存
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useRegisterUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: UserForm) =>
      await apiFetch(`/api/auth/register`, {
        method: "POST",
        body: user,
      }),
    onSuccess: () => {
      // 更新用户列表
      queryClient.invalidateQueries({ queryKey: ["users"] })
      // queryClient.refetchQueries({ queryKey: ["users"] })
    },
  })
}
