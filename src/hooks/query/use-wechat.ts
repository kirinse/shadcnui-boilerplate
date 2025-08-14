import { useMutation } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api-fetch"
import type { CheckResp, Qr, WechatCheck, WechatForm } from "@/schema/wechat"

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

export function useLogoutMutation(user_pid: string) {
  return useMutation({
    mutationFn: async (app_id: string) =>
      await apiFetch<Qr>(`/api/users/${user_pid}/wechats/${app_id}`, {
        method: "DELETE",
      }),
    mutationKey: ["wechat-logout"],
  })
}
