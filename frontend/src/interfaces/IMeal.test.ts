import { type IMeal, zIMeal } from "./IMeal"

describe("IMeal", (): void => {
  it("should validate object", (): void => {
    const zMeal: Record<string, unknown> = zIMeal.safeParse({
      day: 0,
      title: "TEST"
    } as IMeal)
    expect(zMeal.success, "Unable to validate IMeal")
  })

  it("should not validate object", (): void => {
    const zMeal: Record<string, unknown> = zIMeal.safeParse({} as IMeal)
    expect(zMeal.error, "Successfully validated IMeal")
  })
})
