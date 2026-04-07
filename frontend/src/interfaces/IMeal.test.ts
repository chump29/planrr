import { short2 } from "@wordlist/english-eff/short2"
import { RandomWords } from "@wordlist/random"
import randomInt from "random-int"

import { type IMeal, zIMeal } from "./IMeal"

describe("IMeal", (): void => {
  it("should validate object", async (): Promise<void> => {
    const zMeal: Record<string, unknown> = zIMeal.safeParse({
      day: randomInt(0, 6),
      title: await new RandomWords(short2).generate(1).then((word: string[]) => word[0])
    } as IMeal)
    expect(zMeal.success, "Unable to validate IMeal").toBeTruthy()
  })

  it("should not validate object", (): void => {
    const zMeal: Record<string, unknown> = zIMeal.safeParse({} as IMeal)
    expect(zMeal.error, "Successfully validated IMeal").toBeTruthy()
  })
})
