// biome-ignore-all lint/suspicious/noExplicitAny: can log anything

import { bgBlue, bgRed, cyan, red, white } from "recolors"
import { z } from "zod/mini"

import type IDays from "../../interfaces/IDays"

const pad = (n: number): string => {
  return n.toString().padStart(2, "0")
}

const getDate = (): [
  string,
  string,
  string
] => {
  const d = new Date()
  return [
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ]
}

const getTime = (): string => {
  const [h, m, s] = getDate()
  return cyan(" [") + white(`${h}:${m}:${s}`) + cyan("] ")
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
  o.forEach((x: any) => console.info(white(" ⤷"), x))
}

const days: IDays = {
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
  5: "Saturday",
  6: "Sunday"
}

const getUrl = (): string => {
  let API_URL: string = "/api"
  if (import.meta.env.DEV) {
    const u: z.core.util.SafeParseResult<string> = z.url().safeParse(import.meta.env.VITE_API_URL)
    // v8 ignore next -- @preserve
    API_URL = u.success ? `${u.data}${API_URL}` : ""
  }
  return API_URL
}

export { days, error, getUrl, info }
