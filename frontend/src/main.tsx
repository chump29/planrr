import { StrictMode } from "react"

import { ConfirmProvider } from "material-ui-confirm"
import { createRoot } from "react-dom/client"
import { z } from "zod/mini"

import Display from "./components/display"
import { error, info } from "./components/shared"

const DEBUG: boolean = false

z.config(z.locales.en())

const u: z.core.util.SafeParseResult<string> = z.url().safeParse(import.meta.env.VITE_API_URL)
const API_URL: string = u.success ? u.data : ""
if (DEBUG) {
  info(`Got API URL: ${API_URL}`)
}

const getVersion = (version: string): string => {
  return version ? `v${version}` : "N/A"
}

document.getElementById("frontend")!.innerText = getVersion(import.meta.env.PACKAGE_VERSION)

const obj: HTMLElement | null = document.getElementById("backend")
fetch(API_URL + "/api/version", {
  method: "GET",
  signal: AbortSignal.timeout(3000)
})
  .then((response: Response) => {
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`)
    }
    return response.text()
  })
  .then((text: string) => {
    if (DEBUG) {
      info(`Got version: ${text}`)
    }
    const t: z.core.util.SafeParseResult<string> = z
      .string()
      .check(z.regex(/^"\d+\.\d+\.\d+"$/))
      .safeParse(text)
    if (!t.success) {
      throw new Error(t.error.message)
    }
    obj!.innerText = getVersion(t.data.replaceAll('"', ""))
  })
  .catch((e: Error) => {
    error("Could not get version", e)
    obj!.innerText = "N/A"
  })

if (import.meta.env.DEV) {
  createRoot(document.getElementById("root")!).render(
    <ConfirmProvider>
      <Display />
    </ConfirmProvider>
  )
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ConfirmProvider>
        <Display />
      </ConfirmProvider>
    </StrictMode>
  )
}
