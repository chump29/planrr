import { z } from "zod/mini"

interface IMeal {
  day: number
  description: string | null
  id?: number
  title: string
}

const zIMeal: z.ZodMiniObject = z.strictObject({
  day: z.number().check(z.int(), z.minimum(-1), z.maximum(6)),
  description: z._default(z.nullable(z.string().check(z.trim(), z.maxLength(255))), null),
  id: z.optional(z.number().check(z.int(), z.positive())),
  title: z.string().check(z.trim(), z.maxLength(255))
}) satisfies z.ZodMiniType<IMeal>

export { type IMeal, zIMeal }
