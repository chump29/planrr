import { act } from "react"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import createFetchMock, { type FetchMock } from "vitest-fetch-mock"

import { type IMeal } from "../../interfaces/IMeal"
import Display from "."

const fetchMock: FetchMock = createFetchMock(vi)
fetchMock.enableMocks()

beforeEach((): void => {
  vi.clearAllMocks()
  fetchMock.mockIf(`${import.meta.env.VITE_API_URL}/api/get`, (): Promise<string> => {
    return act((): string =>
      JSON.stringify([
        {
          day: 0,
          id: 1,
          title: ""
        } as IMeal
      ])
    )
  })
  render(<Display />)
})

describe("Display", (): void => {
  it("should display Table", async (): Promise<void> => {
    await waitFor((): void => {
      expect(screen.queryByTestId("table"), "Table not found").toBeInTheDocument()
    })
  })

  it("should display Add button", (): void => {
    expect(screen.queryByTestId("AddCircleOutlineIcon"), "Add button not found").toBeInTheDocument()
  })

  it("should display form", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup()
    const button: HTMLButtonElement | null = screen.queryByTestId("AddCircleOutlineIcon")
    expect(button, "Add button not found").toBeInTheDocument()
    await user.click(button as HTMLButtonElement)
    expect(screen.queryByTestId("form"), "Form not found").toBeInTheDocument()
  })

  it("should cancel the form", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup()
    let button: HTMLButtonElement | null = screen.queryByTestId("AddCircleOutlineIcon")
    expect(button, "Add button not found").toBeInTheDocument()
    await user.click(button as HTMLButtonElement)
    await waitFor(async (): Promise<void> => {
      button = screen.queryByTestId("HighlightOffIcon")
      expect(button, "Cancel button not found").toBeInTheDocument()
      await user.click(button as HTMLButtonElement)
      expect(screen.queryByTestId("AddCircleOutlineIcon"), "Did not cancel form").toBeInTheDocument()
    })
  })
})
