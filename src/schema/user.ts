import { z } from "zod"

import { deviceTypeSchema } from "./wechat"

export const userProfileSchema = z.object({
  userId: z.string(),
  avatar: z.string(),
  password: z.string(),
  birthdate: z.date(),
  registeredAt: z.date(),
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    })
    .default(""),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email()
    .default(""),
  bio: z.string().max(160).min(4).default(""),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      }),
    )
    .optional()
    .default([]),
})
export type IUserProfile = z.infer<typeof userProfileSchema>

export const userRoles = ["admin", "user", "guest"] as const

export const appSchema = z.object({
  id: z.string(),
  wx_id: z.string(),
  avatar: z.string().url().optional(),
  device: deviceTypeSchema,
  region_id: z.string().length(6),
  name: z.string().optional(),
  online: z.boolean(),
  proxy: z.string(),
  phone: z.string().optional(),
})

export type App = z.infer<typeof appSchema>

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  pid: z.string().uuid(),
  created_at: z.date(),
  role: z.enum(userRoles),
  is_admin: z.boolean(),
  apps: z.array(appSchema),
})

export type IUser = z.infer<typeof userSchema>

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
})

export type ILoginForm = z.infer<typeof loginFormSchema>

export const userListSchema = z.object({
  results: z.array(userSchema),
  pagination: z.object({
    page: z.number(),
    page_size: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
  }),
})
export type IUserList = z.infer<typeof userListSchema>

export const formSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, "名称必须填写"),
    email: z.string().email({
      message: "Email 必须填写",
    }),
    password: z.string().transform((pwd) => pwd.trim()),
    confirm_password: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    {
      message: "密码必须填写",
      path: ["password"],
    },
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 8
    },
    {
      message: "密码至少8个字符",
      path: ["password"],
    },
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /[a-z]/.test(password)
    },
    {
      message: "密码必须包含字母",
      path: ["password"],
    },
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /\d/.test(password)
    },
    {
      message: "密码必须包含数字",
      path: ["password"],
    },
  )
  .refine(
    ({ isEdit, password, confirm_password }) => {
      if (isEdit && !password) return true
      return password === confirm_password
    },
    {
      message: "两次密码不相同",
      path: ["confirm_password"],
    },
  )
export type UserForm = z.infer<typeof formSchema>
