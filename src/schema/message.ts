import { z } from "zod"

export const orderSchema = z.object({
  id: z.number(),
  lotto: z.string(),
  day: z.date(),
  method: z.string(),
  times: z.number(),
  price: z.number(),
  content: z.string(),
  created_at: z.date(),
})
export type Order = z.infer<typeof orderSchema>

export const messageSchema = z.object({
  id: z.bigint(),
  room_id: z.string(),
  content: z.string(),
  sender: z.string(),
  ts: z.number(),
  orders: z.array(orderSchema),
})
export type Message = z.infer<typeof messageSchema>

export const messageListSchema = z.object({
  summary: z.object({
    page_total: z.number(),
    total: z.number(),
  }),
  results: z.array(messageSchema),
  pagination: z.object({
    page: z.number(),
    page_size: z.number(),
    total_pages: z.number(),
  }),
})
export type MessageList = z.infer<typeof messageListSchema>
