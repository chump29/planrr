import { type ChangeEvent, type EffectCallback, type JSX, useEffect, useState } from "react"

import { ErrorMessage } from "@hookform/error-message"
import AddCircleIcon from "@mui/icons-material/AddCircleOutline"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import SendIcon from "@mui/icons-material/Send"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableContainer from "@mui/material/TableContainer"
import { useForm } from "react-hook-form"
import { z } from "zod/mini"

import { type IMeal, zIMeal } from "../../interfaces/IMeal"
import Row from "../row"
import { days, error, info } from "../shared"

const DEBUG: boolean = false

z.config(z.locales.en())

const Display = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [meals, setMeals] = useState<IMeal[]>([])
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [editing, setEditing] = useState<IMeal | null>(null)
  const [selectedDay, setSelectedDay] = useState<number>(-1)
  const [refreshState, refresh] = useState<number>(0)

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<IMeal>()

  const u: z.core.util.SafeParseResult<string> = z.url().safeParse(import.meta.env.VITE_API_URL)
  const API_URL: string = u.success ? u.data : ""

  const handleAdd = async (): Promise<void> => {
    setIsAdding(true)
  }

  const handleCancel = async (): Promise<void> => {
    setIsAdding(false)
    setSelectedDay(-1)
    setEditing(null)
    reset()
  }

  const onSubmit = async (meal: IMeal): Promise<void> => {
    if (!meal) {
      return
    }
    const m: IMeal | null = zIMeal.parse(meal) as unknown as IMeal
    if (editing) {
      if (m.day == editing.day && m.title === editing.title && m.description === editing.description) {
        if (DEBUG) {
          info(`No update for meal ID ${editing.id}`)
        }
        handleCancel()
        return
      }
      m.id = editing.id
      await fetch(API_URL + "/api/update/" + m.id, {
        body: JSON.stringify(m),
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(`Status: ${response.status}`)
          }
          return response.json()
        })
        .then((meal: IMeal) => {
          if (!meal) {
            throw new Error(`Error editing meal ID ${editing.id}`)
          }
          let m: IMeal | null = zIMeal.parse(meal) as unknown as IMeal
          try {
            m = zIMeal.parse(meal) as unknown as IMeal
            // biome-ignore lint/suspicious/noExplicitAny: catch everything
          } catch (e: any) {
            if (e instanceof z.core.$ZodError) {
              error(z.prettifyError(e))
            } else {
              error(e)
            }
          }
          if (DEBUG) {
            info(`Updated meal ID ${meal.id}`, m)
          }
          refresh(Date.now())
        })
        .catch(error)
    } else {
      m.day = selectedDay
      await fetch(API_URL + "/api/add/", {
        body: JSON.stringify(m),
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(`Status: ${response.status}`)
          }
          return response.json()
        })
        .then((meal: IMeal) => {
          if (!meal) {
            throw new Error("Error adding meal", meal)
          }
          try {
            zIMeal.parse(meal) as unknown as IMeal
            // biome-ignore lint/suspicious/noExplicitAny: catch everything
          } catch (e: any) {
            if (e instanceof z.core.$ZodError) {
              error(z.prettifyError(e))
            } else {
              error(e)
            }
          }
          refresh(Date.now())
        })
        .catch(error)
    }
    handleCancel()
  }

  const handleChange = async (e: ChangeEvent<HTMLSelectElement>): Promise<void> => {
    setSelectedDay(parseInt((e.target as HTMLSelectElement).value))
  }

  const getMeals = async (): Promise<void> => {
    await fetch(API_URL + "/api/get", {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`)
        }
        return response.json()
      })
      .then((meals: IMeal[]) => {
        if (!meals) {
          if (DEBUG) {
            info("No meals found")
          }
          return
        }
        const m: IMeal[] | null = z.array(zIMeal).parse(meals) as unknown[] as IMeal[]
        if (DEBUG) {
          info("Getting all meals", m)
        }
        setMeals(m)
        setIsLoading(false)
      })
      .catch(error)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies(getMeals): not a dependency
  // biome-ignore lint/correctness/useExhaustiveDependencies(refreshState): is a dependency
  useEffect((): ReturnType<EffectCallback> => {
    if (DEBUG) {
      info("useEffect() called")
    }
    setIsLoading(true)
    getMeals()
  }, [
    refreshState
  ])

  return (
    <>
      <div className="text-center mt-10 mx-auto px-1 max-w-xl">
        {isLoading ? (
          <CircularProgress
            sx={{
              color: "#c4751c"
            }}
          />
        ) : meals.length ? (
          <>
            <TableContainer
              sx={{
                borderRadius: "6px"
              }}>
              <Table data-testid="table">
                <TableBody
                  sx={{
                    backgroundColor: "#932c04"
                  }}>
                  {meals.map((meal: IMeal, i: number) => (
                    <Row
                      id={i}
                      key={meal.id}
                      meal={meal}
                      refresh={refresh}
                      setEditing={setEditing}
                      setIsAdding={setIsAdding}
                      setSelectedDay={setSelectedDay}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <div className="text-2xl font-bold italic">There are no meals to display</div>
        )}
      </div>
      {isAdding ? (
        <div className="text-center mt-10">
          <IconButton
            onClick={handleCancel}
            size="small"
            sx={{
              border: "1px solid #c4751c",
              borderRadius: "6px",
              color: "#eddfc5",
              cursor: "pointer",
              width: "120px",
              "& svg": {
                marginRight: "5px"
              }
            }}
            title="Cancel">
            <HighlightOffIcon
              sx={{
                color: "#932c04",
                height: "16px",
                width: "16px"
              }}
            />
            Cancel
          </IconButton>
          <form
            className="text-center border border-brown2 size-fit mx-auto px-3 pt-3 my-5"
            data-testid="form"
            onSubmit={handleSubmit(onSubmit)}>
            <select
              title="Choose a day..."
              {...register("day", {
                required: true,
                valueAsNumber: true,
                min: {
                  message: "Day must be selected",
                  value: 0
                }
              })}
              className="border text-yellow2 border-yellow rounded-md px-3 py-1.5 mr-3 mb-3 cursor-pointer"
              defaultValue={selectedDay}
              onChange={handleChange}
              style={
                errors.day && {
                  border: "3px double #932c04"
                }
              }>
              <option className="bg-red2 font-bold" key="0" value="-1">
                Choose a day...
              </option>
              {Object.keys(days)
                .filter((i: string): string | null => {
                  return editing && editing.day === parseInt(i)
                    ? i
                    : !meals.find((meal) => meal.day === parseInt(i))
                      ? i
                      : null
                })
                .map((i: string) => (
                  <option className="bg-red2" key={i} value={i}>
                    {days[parseInt(i)]}
                  </option>
                ))}
            </select>
            <input
              {...register("title", {
                maxLength: {
                  message: "Title exceeds the maximum length (255)",
                  value: 255
                },
                required: {
                  message: "Title is required",
                  value: true
                }
              })}
              className="rounded-md px-3 py-1.5 text-yellow2 border border-yellow placeholder:text-yellow inline mr-3 mb-3"
              defaultValue={editing?.title}
              placeholder="Enter meal title..."
              style={
                errors.title && {
                  border: "3px double #932c04"
                }
              }
              title="Enter meal title..."
              type="text"
            />
            <textarea
              {...register("description", {
                maxLength: {
                  message: "Description exceeds the maximum length (255)",
                  value: 255
                }
              })}
              className="resize-none rounded-md px-3 py-1.5 text-yellow2 border border-yellow placeholder:text-yellow inline mr-3 align-middle mb-3"
              cols={20}
              defaultValue={editing?.description ?? undefined}
              placeholder="Enter meal description..."
              rows={2}
              style={
                errors.description && {
                  border: "3px double #932c04"
                }
              }
              title="Enter meal description..."
            />
            <IconButton
              size="small"
              sx={{
                border: "1px solid #c4751c",
                borderRadius: "6px",
                color: "#eddfc5",
                cursor: "pointer",
                width: "120px",
                "& svg": {
                  marginRight: "5px"
                }
              }}
              title="Submit"
              type="submit">
              <SendIcon
                sx={{
                  color: "#c4751c",
                  height: "16px",
                  width: "16px"
                }}
              />
              Submit
            </IconButton>
          </form>
          <div className="font-bold italic">
            <ErrorMessage errors={errors} name="day" />
          </div>
          <div className="font-bold italic">
            <ErrorMessage errors={errors} name="title" />
          </div>
          <div className="font-bold italic">
            <ErrorMessage errors={errors} name="description" />
          </div>
        </div>
      ) : (
        <div className="text-center mt-10">
          <IconButton
            onClick={handleAdd}
            size="small"
            sx={{
              border: "1px solid #c4751c",
              borderRadius: "6px",
              color: "#eddfc5",
              cursor: "pointer",
              width: "120px",
              "& svg": {
                marginRight: "5px"
              }
            }}
            title="Add Meal">
            <AddCircleIcon
              sx={{
                color: "#c4751c",
                height: "16px",
                width: "16px"
              }}
            />
            Add Meal
          </IconButton>
        </div>
      )}
    </>
  )
}

export default Display
