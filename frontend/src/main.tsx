import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import Display from "./components/display"

const api_url = import.meta.env.VITE_API_URL || ""

function getVersion(version: string) {
  return version.length ? `v${version}` : "N/A"
}

document.getElementById("frontend")!.innerText = getVersion(
  import.meta.env.PACKAGE_VERSION
)

const obj = document.getElementById("backend")
fetch(api_url + "/api/version", {
  method: "GET",
  signal: AbortSignal.timeout(3000)
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Status: ${response.status}`)
    }
    return response.text()
  })
  .then((text) => {
    if (!text.length) {
      throw new Error("Invalid response")
    }
    obj!.innerText = getVersion(text.replaceAll('"', ""))
  })
  .catch((e) => {
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
