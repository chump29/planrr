import { type Mock } from "vitest"

import { days, error, getUrl, info } from "."

const errorSpy: Mock = vi.spyOn(console, "error")
const infoSpy: Mock = vi.spyOn(console, "info")

const TEST: string = "TEST"

describe("error", (): void => {
  it("should not log anything", (): void => {
    error()
    expect(errorSpy, "Tried to write error to console").not.toHaveBeenCalled()
  })
  it("should log an error", (): void => {
    error(TEST)
    expect(errorSpy, "Could not write error to console").toHaveBeenCalledTimes(2)
  })
})

describe("info", (): void => {
  it("should not log anything", (): void => {
    info()
    expect(infoSpy, "Tried to write info to console").not.toHaveBeenCalled()
  })
  it("should log info", (): void => {
    info(TEST)
    expect(infoSpy, "Could not write info to console").toHaveBeenCalledTimes(2)
  })
})

describe("days", (): void => {
  it("should get days", (): void => {
    expect(days[0] == "Monday", "Error getting days")
  })
})

describe("DEV URL", (): void => {
  it("should get DEV API URL", (): void => {
    const API_URL: string = getUrl()
    expect(API_URL === `${import.meta.env.VITE_API_URL}/api`, "Could not get API URL")
  })
})

describe("PROD URL", (): void => {
  it("should get PROD API URL", (): void => {
    vi.stubEnv("DEV", false)
    const API_URL: string = getUrl()
    expect(API_URL === "/api", "Could not get API URL")
  })
})
