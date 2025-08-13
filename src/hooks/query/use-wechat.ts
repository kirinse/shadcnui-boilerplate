import { useMutation, useQuery } from "@tanstack/react-query"

import { apiFetch } from "@/lib/api-fetch"
import type { CheckResp, Qr, WechatCheck, WechatForm } from "@/schema/wechat"

export function useLoginMutation(user_pid: string) {
  return useMutation({
    mutationFn: async (loginForm: WechatForm) =>
      await apiFetch<Qr>(`/api/users/${user_pid}/wechats`, {
        method: "POST",
        body: loginForm,
      }),
    mutationKey: ["wechat-login"],
  })
}

export function useCheck(user_pid: string, body: WechatCheck) {
  return useQuery({
    queryKey: ["wechat-login-check", user_pid],
    queryFn: async () => apiFetch<CheckResp>(`/api/users/${user_pid}/wechats`, {
      method: "TRACE",
      body,
    }),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    enabled: false,
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
