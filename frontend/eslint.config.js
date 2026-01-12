import js from "@eslint/js"
import react from "eslint-plugin-react"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      js,
      react
    },
    extends: ["js/recommended"],
    languageOptions: {
      parserOptions: {
        emcaFeatures: {
          jsx: true
        }
      },
      globals: { ...globals.browser }
    },
    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  tseslint.configs.recommended
])
