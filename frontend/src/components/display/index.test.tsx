import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { short2 } from "@wordlist/english-eff/short2"
import { RandomWords } from "@wordlist/random"
import randomInt from "random-int"
import { titleCase } from "title-case"

import { type IMeal } from "../../interfaces/IMeal.ts"
import { fetchMock } from "../../setup.ts"
import { days } from "../shared/index.ts"
import Display from "./index.tsx"

const getTitle = async (): Promise<string> => {
  return await new RandomWords(short2)
    .generate(2)
    .then((words: string[]) => words.map((word: string) => titleCase(word)).join(" "))
}

const meals: IMeal[] = [
  {
    day: randomInt(1, 6),
    id: 1,
    title: await getTitle()
  } as IMeal
] as IMeal[]

const newMeal: IMeal = {
  ...meals[0],
  title: await getTitle()
}

beforeEach((): void => {
  fetchMock.resetMocks()
  // biome-ignore lint/performance/useTopLevelRegex: test
  fetchMock.mockIf(/\/api/, async (req: Request): Promise<string> => {
    if (req.url.endsWith("/get")) {
      return await act((): string => JSON.stringify(meals))
    } else if (req.url.endsWith("/add")) {
      return await act((): string => JSON.stringify(meals[0]))
    } else if (req.url.endsWith("/get/1")) {
      return await act((): string => JSON.stringify(meals[0]))
    } else if (req.url.includes("/update/")) {
      return await act(async (): Promise<string> => JSON.stringify(newMeal))
    } else {
      const error: string = `Invalid API call: ${req.url}`
      throw new Error(error)
    }
  })
  render(<Display />)
})

describe("Display", (): void => {
  it("should display Table", async (): Promise<void> => {
    await waitFor((): void => {
      expect(screen.queryByTestId("table"), "Table not found").toBeInTheDocument()
      expect(fetchMock, "Called /get more than once").toHaveBeenCalledOnce()
      expect(fetchMock, "Did not return meals").toHaveLastReturnedWith(Promise.resolve(meals))
    })
  })

  it("should display Add button", (): void => {
    expect(screen.queryByTestId("AddCircleOutlineIcon"), "Add button not found").toBeInTheDocument()
  })

  const displayForm = async (): Promise<UserEvent> => {
    const user: UserEvent = userEvent.setup()
    const button: HTMLButtonElement | null = screen.queryByTestId("AddCircleOutlineIcon")
    expect(button, "Add button not found").toBeInTheDocument()
    await user.click(button as HTMLButtonElement)
    return user
  }

  it("should display form", async (): Promise<void> => {
    await displayForm()
    expect(screen.queryByTestId("form"), "Form not found").toBeInTheDocument()
    expect(screen.queryByRole("combobox"), "Select not found").toBeInTheDocument()
    expect(screen.queryByTestId("title"), "Title not found").toBeInTheDocument()
    expect(screen.queryByTestId("description"), "Description not found").toBeInTheDocument()
    expect(screen.queryByTestId("SendIcon"), "Submit button not found").toBeInTheDocument()
  })

  it("should cancel the form", async (): Promise<void> => {
    const user: UserEvent = await displayForm()
    await waitFor(async (): Promise<void> => {
      const button = screen.queryByTestId("HighlightOffIcon")
      expect(button, "Cancel button not found").toBeInTheDocument()
      await user.click(button as HTMLButtonElement)
      expect(screen.queryByTestId("AddCircleOutlineIcon"), "Did not cancel form").toBeInTheDocument()
    })
  })

  it("should add a meal", async (): Promise<void> => {
    const user: UserEvent = await displayForm()
    const select: HTMLSelectElement = screen.queryByRole("combobox") as HTMLSelectElement
    expect(select.length, "Did not load days").toBe(7)
    expect(select, "Default value not selected").toHaveValue("-1")
    const sunday: string = days.indexOf("Sunday").toString()
    await user.selectOptions(select, sunday)
    expect(select, "Did not select Sunday").toHaveValue(sunday)
    const title: HTMLInputElement = screen.queryByTestId("title") as HTMLInputElement
    await user.type(title, meals[0].title)
    expect(title, "Did not enter title").toHaveValue(meals[0].title)
    const button: HTMLButtonElement = screen.queryByTestId("SendIcon") as HTMLButtonElement
    await user.click(button)
    expect(fetchMock, "Called /add more than once").toHaveBeenCalledTimes(2)
    expect(fetchMock, "Did not return meal").toHaveReturnedWith(Promise.resolve(meals[0]))
  })

  it("should edit a meal", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup()
    await waitFor(async (): Promise<void> => {
      let button: HTMLButtonElement | null = screen.queryByTestId("EditIcon")
      expect(button, "Edit button not found").toBeInTheDocument()
      await user.click(button as HTMLButtonElement)
      await waitFor(async (): Promise<void> => {
        const title: HTMLInputElement | null = screen.queryByTestId("title")
        expect(title, "Did not find anything to edit").toBeInTheDocument()
        await user.clear(title as HTMLInputElement)
        await user.type(title as HTMLInputElement, newMeal.title)
        expect(title as HTMLInputElement, "Did not change title").toHaveValue(newMeal.title)
        button = screen.queryByTestId("SendIcon")
        await user.click(button as HTMLButtonElement)
        expect(fetchMock, "Called /update more than once").toHaveBeenCalledTimes(3)
        expect(fetchMock, "Did not return updated meal").toHaveReturnedWith(Promise.resolve(newMeal))
      })
    })
  })
})
