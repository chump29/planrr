import "@testing-library/jest-dom"

import { cleanup } from "@testing-library/react"
import createFetchMock, { type FetchMock } from "vitest-fetch-mock"

const fetchMock: FetchMock = createFetchMock(vi)

beforeAll((): void => {
  fetchMock.enableMocks()
})

afterEach((): void => {
  cleanup()
})

afterAll((): void => {
  fetchMock.disableMocks()
})

export { fetchMock }
