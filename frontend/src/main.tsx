import { StrictMode } from "react"

import { ConfirmProvider } from "material-ui-confirm"
import { createRoot } from "react-dom/client"
import { z } from "zod/mini"

import Display from "./components/display"
import { error, info } from "./components/shared"

const DEBUG: boolean = true

z.config(z.locales.en())

const u: z.core.util.SafeParseResult<string> = z.url().safeParse(import.meta.env.VITE_API_URL)
const API_URL: string = u.success ? u.data : ""
if (DEBUG) {
  info(`Got API URL: ${API_URL}`)
}

const getVersion = (version: string): string => {
  return version ? `v${version}` : "N/A"
}

const v: z.core.util.SafeParseResult<string> = z
  .string()
  .check(z.regex(/^\d+\.\d+\.\d+$/))
  .safeParse(import.meta.env.PACKAGE_VERSION)
const UI_VERSION: string = v.success ? v.data : ""
if (DEBUG) {
  info(`Got UI version: ${UI_VERSION}`)
}
document.getElementById("frontend")!.innerText = getVersion(UI_VERSION)

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
  .then((url: string) => {
    const u: z.core.util.SafeParseResult<string> = z
      .string()
      .check(z.regex(/^\d+\.\d+\.\d+$/))
      .safeParse(url)
    if (!u.success) {
      throw new Error(u.error.message)
    }
    if (DEBUG) {
      info(`Got API version: ${u.data}`)
    }
    obj!.innerText = getVersion(u.data)
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
