import { z } from "zod"

export const lottoType = ["福", "体"] as const
export const lottoTypeSchema = z.enum(lottoType)
export type LottoType = z.infer<typeof lottoTypeSchema>

export const orderSchema = z.object({
  id: z.number(),
  lotto: z.string(),
  day: z.date(),
  method: z.string(),
  times: z.number(),
  price: z.number(),
  content: z.string(),
  numbers: z.array(z.number()),
  prize: z.number(),
  created_at: z.date(),
  message_id: z.coerce.bigint(),
})
export const messageStatusSchema = z.enum(["Pending", "Finished", "Failed", "Deleted", "Revoked", "Warning"])

export type Order = z.infer<typeof orderSchema>
export type MessageStatus = z.infer<typeof messageStatusSchema>

export const messageSchema = z.object({
  id: z.coerce.bigint(),
  room_id: z.string(),
  content: z.string(),
  sender: z.string(),
  ts: z.number(),
  status: messageStatusSchema,
  version: z.number(),
  orders: z.array(orderSchema),
})
export type Message = z.infer<typeof messageSchema>

export const messageListSchema = z.object({
  summary: z.object({
    page_total: z.number(),
    // total: z.record(z.string(), z.number()),
  }),
  results: z.array(messageSchema),
  pagination: z.object({
    page: z.number(),
    page_size: z.number(),
    total_pages: z.number(),
  }),
})
export type MessageList = z.infer<typeof messageListSchema>

export const formSchema = z
  .object({
    id: z.coerce.bigint(),
    content: z.string().transform((s) => s.trim()).refine((s) => s.length > 0, { message: "内容不能为空" }),
    // messages: z.array(z.string())/*.transform((s) => s.join("\n"))*/,
  })
export type MessageForm = z.infer<typeof formSchema>
