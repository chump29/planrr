import { StrictMode } from "react"

import { createRoot } from "react-dom/client"

import Display from "./components/display"

const api_url: string = import.meta.env.VITE_API_URL || ""

const getVersion = (version: string): string => {
  return version.length ? `v${version}` : "N/A"
}

document.getElementById("frontend")!.innerText = getVersion(
  import.meta.env.PACKAGE_VERSION
)

const obj: HTMLElement | null = document.getElementById("backend")
fetch(api_url + "/api/version", {
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
    if (!text.length) {
      throw new Error("Invalid response")
    }
    obj!.innerText = getVersion(text.replaceAll('"', ""))
  })
  .catch((e: Error) => {
    console.error(e)
    obj!.innerText = "N/A"
  })

if (import.meta.env.DEV) {
  createRoot(document.getElementById("root")!).render(<Display />)
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Display />
    </StrictMode>
  )
}
