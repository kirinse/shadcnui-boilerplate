import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api-fetch"
import type { CheckResp, DispatchForm, Qr, WechatCheck, WechatForm } from "@/schema/wechat"

export function useLoginMutation(user_pid: string | null) {
  return useMutation({
    mutationFn: async (loginForm: WechatForm) =>
      await apiFetch<Qr>(`/api/users/${user_pid}/wechats`, {
        method: "POST",
        body: loginForm,
      }),
    mutationKey: ["wechat-login"],
  })
}

export function useCheckMutation(user_pid: string | null) {
  return useMutation({
    mutationKey: ["wechat-login-check", user_pid],
    mutationFn: async (body: WechatCheck) => apiFetch<CheckResp>(`/api/users/${user_pid}/wechats/${body.appId}`, {
      method: "POST",
      body,
    }),
    retry: 3,
    retryDelay: 5000,
    // refetchInterval: 5000,
    // refetchIntervalInBackground: true,
    // refetchOnWindowFocus: true,
    // enabled: false,
  })
}

export function useLogoutMutation(src?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ user_pid, app_id }: { user_pid: string, app_id: string }) =>
      await apiFetch(`/api/users/${user_pid}/wechats/${app_id}`, {
        method: "PATCH",
      }),
    mutationKey: ["wechat-logout"],
    onSuccess: () => {
      if (src === "list") {
        // 更新用户列表缓存
        queryClient.invalidateQueries({ queryKey: ["users"] })
      } else {
        // TODO: 更新用户自己信息
        queryClient.invalidateQueries({ queryKey: ["user-info"] })
      }
    },
  })
}

export function useDispatchMutation() {
  return useMutation({
    mutationFn: async (body: DispatchForm) =>
      await apiFetch(`/api/users/${body.pid}/${body.appId}/dispatch`, {
        method: "POST",
        body,
      }),
    mutationKey: ["dispatch"],
  })
}
