// biome-ignore-all lint/suspicious/noExplicitAny: can log anything

import { format } from "date-and-time"
import days from "days"
import { bgBlue, bgRed, cyan, red, white } from "recolors"
import { z } from "zod/mini"

delete days.abbr
delete days.short

const getTime = (): string => {
  return cyan(" [") + white(format(new Date(), "HH:mm:ss")) + cyan("] ")
}

const error = (...o: any[]): void => {
  if (!o.length) {
    return
  }
  console.error(bgRed(white(" ERROR ")) + getTime())
  o.forEach((x: any) => console.error(red(" ⤷"), x))
}

const info = (...o: any[]): void => {
  if (!o.length) {
    return
  }
  console.info(bgBlue(white(" INFO ")) + getTime())
  o.forEach((x: any) => console.info(cyan(" ⤷"), x))
}

const getUrl = (): string => {
  let API_URL: string = "/api"
  if (import.meta.env.DEV) {
    const u: z.core.util.SafeParseResult<string> = z.url().safeParse(import.meta.env.VITE_API_URL)
    API_URL = u.success ? `${u.data}${API_URL}` : ""
  }
  return API_URL
}

export { days, error, getUrl, info }
