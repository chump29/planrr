import { StrictMode } from "react"

import { ConfirmProvider } from "material-ui-confirm"
import { createRoot } from "react-dom/client"
import { z } from "zod/mini"

import Display from "./components/display"
import { error, info } from "./components/shared"

const DEBUG: boolean = false

z.config(z.locales.en())

const u: z.core.util.SafeParseResult<string> = z.url().safeParse(import.meta.env.VITE_API_URL)
const API_URL: string = u.success ? `${u.data}/api` : ""
if (DEBUG) {
  info(`Got API URL: ${API_URL}`)
}

const getVersion = (version: string): string => {
  return version ? `v${version}` : "N/A"
}

let version: string = ""
try {
  version = z
    .string()
    .check(z.regex(/^\d+\.\d+\.\d+$/))
    .parse(import.meta.env.PACKAGE_VERSION)
  if (DEBUG) {
    info(`Got UI version: ${version}`)
  }
  // biome-ignore lint/suspicious/noExplicitAny: catch everything
} catch (e: any) {
  error("Could not get UI version", e)
}
document.getElementById("frontend")!.innerText = getVersion(version)

const obj: HTMLElement | null = document.getElementById("backend")
fetch(`${API_URL}/version`, {
  signal: AbortSignal.timeout(3000)
})
  .then((response: Response) => {
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`)
    }
    return response.text()
  })
  .then((version: string) => {
    const v: z.core.util.SafeParseResult<string> = z
      .string()
      .check(z.regex(/^\d+\.\d+\.\d+$/))
      .safeParse(version.replaceAll('"', ""))
    if (!v.success) {
      throw new Error(v.error.message)
    }
    if (DEBUG) {
      info(`Got API version: ${v.data}`)
    }
    obj!.innerText = getVersion(v.data)
  })
  .catch((e: Error) => {
    error("Could not get API version", e)
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
