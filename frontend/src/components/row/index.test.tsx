import { render, screen } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"

import { type IMeal } from "../../interfaces/IMeal"
import Row from "."

const TITLE: string = "TESTME1"
const DESCRIPTION: string = "TESTME2"

beforeEach((): void => {
  render(
    <Row
      id={1}
      meal={
        {
          day: 0,
          description: DESCRIPTION,
          id: 1,
          title: TITLE
        } as IMeal
      }
      refresh={vi.fn()}
      setEditing={vi.fn()}
      setIsAdding={vi.fn()}
      setSelectedDay={vi.fn()}
    />
  )
})

describe("Row", (): void => {
  it("should display TableRow", (): void => {
    expect(screen.queryByTestId("tr"), "TableRow not found").toBeInTheDocument()
  })

  it("should contain title", (): void => {
    expect(screen.queryByText(TITLE), "Title not found").toBeInTheDocument()
  })

  it("should not contain description", (): void => {
    expect(screen.queryByText(DESCRIPTION), "Description found").not.toBeInTheDocument()
  })

  it("should expand row", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup()
    const button: HTMLButtonElement | null = screen.queryByTestId("expand")
    expect(button, "Expand button not found")
    if (button) {
      await user.click(button)
      expect(screen.queryByTestId("description"), "Row not expanded").toBeInTheDocument()
    }
  })

  it("should contain description", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup()
    const button: HTMLButtonElement | null = screen.queryByTestId("expand")
    if (button) {
      await user.click(button)
      expect(screen.queryByText(DESCRIPTION), "Description not found").toBeInTheDocument()
    }
  })
})
