import { render, screen } from "@testing-library/react"

import Display from "."

beforeEach(() => {
  render(<Display />)
})

describe("Display", () => {
  it("should display DataTable", () => {
    expect(
      screen.queryByRole("table", { name: "dtMenu" }),
      "DataTable not found"
    ).toBeInTheDocument()
  })

  it("should display Add button", () => {
    expect(
      screen.queryByRole("button", { name: "Add Meal" }),
      "Add button not found"
    ).toBeInTheDocument()
  })
})
