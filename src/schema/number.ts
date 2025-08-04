import { z } from "zod"

export const numberSchema = z.object({
  number: z.string(),
  prize: z.number(),
})

export type INumber = z.infer<typeof numberSchema>

export const riskSchema = z.object({
  number: z.string(),
  prize: z.number(),
})

export type IRisk = z.infer<typeof riskSchema>

export const numberDetailsSchema = z.object({
  method: z.string(),
  orders: z.number(),
  times: z.number(),
  prize: z.number(),
})

export type INumberDetails = z.infer<typeof numberDetailsSchema>

export const SummarySchema = z.record(z.string(), z.number())

export type ISummary = z.infer<typeof SummarySchema>
