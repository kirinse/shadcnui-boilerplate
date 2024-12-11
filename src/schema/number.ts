import { z } from "zod"

export const numberSchema = z.object({
  id: z.number(),
  lotto: z.string(),
  day: z.date(),
  number: z.string(),
  prize: z.number(),
  updated_at: z.date(),
})

export type INumber = z.infer<typeof numberSchema>
