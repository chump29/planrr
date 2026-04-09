import { act, render, screen } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { short2 } from "@wordlist/english-eff/short2"
import { RandomWords } from "@wordlist/random"
import { ConfirmProvider } from "material-ui-confirm"
import randomInt from "random-int"
import { titleCase } from "title-case"

import { type IMeal } from "../../interfaces/IMeal.ts"
import { fetchMock } from "../../setup.ts"
import Row from "./index.tsx"

const getWords = async (): Promise<string> => {
  return await new RandomWords(short2)
    .generate(2)
    .then((words: string[]) => words.map((word: string) => titleCase(word)).join(" "))
}

const meal: IMeal = {
  day: randomInt(0, 6),
  description: await getWords(),
  id: 1,
  title: await getWords()
} as IMeal

beforeEach(async (): Promise<void> => {
  fetchMock.resetMocks()
  // biome-ignore lint/performance/useTopLevelRegex: test
  fetchMock.mockIf(/\/api/, async (req: Request): Promise<string> => {
    if (req.url.endsWith("/get")) {
      return await act((): string =>
        JSON.stringify([
          meal
        ])
      )
    } else if (req.url.includes("/delete/")) {
      return await act(async (): Promise<string> => JSON.stringify(true))
    } else {
      const error: string = `Invalid API call: ${req.url}`
      throw new Error(error)
    }
  })
  render(
    <ConfirmProvider>
      <Row
        handleCancel={vi.fn()}
        id={1}
        meal={meal}
        refresh={vi.fn()}
        setEditing={vi.fn()}
        setIsAdding={vi.fn()}
        setSelectedDay={vi.fn()}
      />
    </ConfirmProvider>
  )
})

describe("Row", (): void => {
  it("should display TableRow", (): void => {
    expect(screen.queryByTestId("tr"), "TableRow not found").toBeInTheDocument()
  })

  it("should contain title", (): void => {
    expect(screen.queryByText(meal.title), "Title not found").toBeInTheDocument()
  })

  it("should not contain description", (): void => {
    expect(screen.queryByText(meal.description as string), "Description found").not.toBeInTheDocument()
  })

  const getExpandButton = (): [
    UserEvent,
    HTMLButtonElement
  ] => {
    const user: UserEvent = userEvent.setup()
    const button: HTMLButtonElement | null = screen.queryByTestId("KeyboardArrowDownIcon")
    expect(button, "Expand button not found").toBeInTheDocument()
    return [
      user,
      button as HTMLButtonElement
    ]
  }

  it("should expand row", async (): Promise<void> => {
    const [user, button] = getExpandButton()
    await user.click(button as HTMLButtonElement)
    expect(screen.queryByTestId("description"), "Row not expanded").toBeInTheDocument()
    expect(screen.queryByTestId("KeyboardArrowUpIcon"), "Collapse button not found").toBeInTheDocument()
  })

  it("should contain description", async (): Promise<void> => {
    const [user, button] = getExpandButton()
    await user.click(button as HTMLButtonElement)
    expect(screen.queryByText(meal.description as string), "Description not found").toBeInTheDocument()
  })

  it("should delete a meal", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup()
    let button: HTMLButtonElement | null = screen.queryByTestId("DeleteIcon")
    expect(button, "Did not find anything to delete").toBeInTheDocument()
    await user.click(button as HTMLButtonElement)
    button = screen.queryByText("Yes")
    expect(button, "Yes button not found").toBeInTheDocument()
    await userEvent.click(button as HTMLButtonElement)
    expect(fetchMock, "Called /delete more than once").toHaveBeenCalledTimes(1)
    expect(fetchMock, "Did not delete meal").toHaveReturnedWith(Promise.resolve(true))
  })
})
