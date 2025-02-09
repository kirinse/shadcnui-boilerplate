import { FetchError, ofetch } from "ofetch"

import { authStorage } from "@/atoms/auth"

import { getRedirectToLoginUrl } from "./utils"

const store = authStorage

export const apiFetch = ofetch.create({
  credentials: "include",
  retry: false,
  onRequest: async ({ options }) => {
    const header = new Headers(options.headers)

    options.headers = header

    const { token } = store.getItem("auth", {}) as { token: string }

    if (token) {
      options.headers.append("Authorization", `Bearer ${token}`)
    }

    if (options.method && options.method.toLowerCase() !== "get") {
      if (typeof options.body === "string") {
        options.body = JSON.parse(options.body)
      }
      if (!options.body) {
        options.body = {}
      }
    }
  },
  onResponse() {
    // TODO: response interceptor
  },
  onResponseError(context) {
    if (context.response.status === 401) {
      store.setItem("auth", {})
      return redirectToLogin()
    }
  },
})

export function redirectToLogin() {
  if (window.location.pathname === "/login") {
    return
  }
  const redirectUrl = getRedirectToLoginUrl()
  window.location.replace(redirectUrl)
}

export const getFetchErrorMessage = (error: Error) => {
  if (error instanceof FetchError) {
    try {
      const json = error.response?._data
      const { message } = json
      return `${message || error.message}`
    } catch {
      return error.message
    }
  }

  return error.message
}
