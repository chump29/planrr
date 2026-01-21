import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import version from "vite-plugin-package-version"
import simpleHtml from "vite-plugin-simple-html"
import webFontDownload from "vite-plugin-webfont-dl"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [
    react(),
    simpleHtml({
      inject: {
        data: {
          title: "Planrr"
        }
      },
      minify: true
    }),
    tailwindcss(),
    webFontDownload(
      [
        "https://fonts.googleapis.com/css2?family=Montserrat&display=swap",
        "https://fonts.googleapis.com/css2?family=Yellowtail&display=swap"
      ],
      { assetsSubfolder: "fonts", injectAsStyleTag: false }
    ),
    version()
  ],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["./src/**/*.test.tsx"],
    reporters: [["verbose", { summary: true }]],
    setupFiles: "./src/setup.ts",
    silent: true
  }
})
