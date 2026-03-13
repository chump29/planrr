import { type ChangeEvent, type JSX, type MouseEvent, useEffect, useState } from "react"

import {
  MinusIcon,
  PencilIcon,
  PlayCircleIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"
import DataTable, { type TableColumn, type TableStyles } from "react-data-table-component"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from "react-toastify"

interface Days {
  [key: number]: string
}

const days: Days = {
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
  5: "Saturday",
  6: "Sunday"
}

interface IMeal {
  day: number
  description: string
  disabled: boolean
  expanded: boolean
  id: number
  title: string
}

const API_URL: string = import.meta.env.VITE_API_URL || ""

export default function Display(): JSX.Element {
  const [meals, setMeals] = useState<IMeal[]>([])
  const [expandAll, setExpandAll] = useState<boolean>(false)
  const [showAdd, setShowAdd] = useState<boolean>(true)
  const [showCancel, setShowCancel] = useState<boolean>(false)
  const [editing, setEditing] = useState<IMeal | null>(null)
  const [selectedDay, setSelectedDay] = useState<number>(-1)
  const [pending, setPending] = useState<boolean>(true)

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<IMeal>()

  const onSubmit = async (meal: IMeal): Promise<void> => {
    if (editing) {
      if (
        meal.day == editing.day && // string(?) == number
        meal.title === editing.title &&
        meal.description === editing.description
      ) {
        cancel()
        return
      }
      meal.id = editing.id
      await fetch(API_URL + "/api/update/" + meal.id, {
        body: JSON.stringify(meal),
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
            console.error(editing)
            throw new Error("Error editing meal")
          }
          getMeals()
        })
        .catch(console.error)
    } else {
      meal.day = selectedDay
      await fetch(API_URL + "/api/add/", {
        body: JSON.stringify(meal),
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
            console.error(meal)
            throw new Error("Error adding meal")
          }
          getMeals()
        })
        .catch(console.error)
    }
  }

  const showError = async (): Promise<void> => {
    toast.error("ID not found. This shouldn't happen, but it does sometimes. I'm working on it. Please try again.", {
      toastId: "notFoundError"
    })
  }

  const handleEdit = async (e: MouseEvent<SVGSVGElement>): Promise<void> => {
    const id: string | undefined = (e.target as SVGElement).dataset.id
    if (!id) {
      await showError()
      console.error(e)
      throw new Error("ID not found for edit")
    }
    await fetch(API_URL + "/api/get/" + id)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`)
        }
        return response.json()
      })
      .then((meal: IMeal) => {
        if (!meal) {
          throw new Error(`Error getting id: ${id}`)
        }
        show()
        setSelectedDay(meal.day)
        setEditing(meal)
      })
      .catch(console.error)
  }

  const handleDelete = async (e: MouseEvent<SVGSVGElement>): Promise<void> => {
    const id: string | undefined = (e.target as SVGElement).dataset.id
    if (!id) {
      await showError()
      console.error(e)
      throw new Error("ID not found for delete")
    }
    await fetch(API_URL + "/api/delete/" + id, {
      method: "DELETE"
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`)
        }
        return response.json()
      })
      .then((result: boolean) => {
        if (!result) {
          throw new Error(`Error deleting id: ${id}`)
        }
        getMeals()
      })
      .catch(console.error)
  }

  const cols: TableColumn<IMeal>[] = [
    {
      width: "120px",
      selector: (meal: IMeal) => days[meal.day]
    },
    {
      wrap: true,
      selector: (meal: IMeal) => meal.title
    },
    {
      button: true,
      ignoreRowClick: true,
      width: "30px",
      cell: (meal: IMeal) => (
        <PencilIcon className="size-4 text-yellow cursor-pointer" data-id={meal.id} onClick={handleEdit} title="Edit" />
      )
    },
    {
      button: true,
      ignoreRowClick: true,
      width: "30px",
      cell: (meal: IMeal) => (
        <TrashIcon
          className="size-4 text-yellow cursor-pointer"
          data-id={meal.id}
          onClick={handleDelete}
          title="Remove"
        />
      )
    }
  ]

  // biome-ignore lint/nursery/useExplicitType: T is IMeal
  const expanded: ExpandableRowsComponent<IMeal> = ({ data }) => <span>{data.description}</span>

  const customStyles: TableStyles = {
    expanderButton: {
      style: {
        color: "#c4751c" /* text-yellow */,
        "&:disabled": {
          display: "none"
        }
      }
    },
    expanderRow: {
      style: {
        backgroundColor: "#3f2723" /* bg-brown2 */,
        color: "#eddfc5" /* text-yellow2 */,
        fontSize: "12px",
        fontWeight: "normal",
        padding: "2px 5px",
        textAlign: "left"
      }
    },
    noData: {
      style: {
        backgroundColor: "#932c04" /* bg-red */,
        color: "#eddfc5" /* text-yellow2 */,
        fontSize: "14px",
        fontWeight: "bold",
        padding: "24px"
      }
    },
    progress: {
      style: {
        backgroundColor: "#932c04" /* bg-red */,
        border: "1px solid #c4751c" /* border-yellow */,
        borderRadius: "6px" /* rounded-md */
      }
    },
    rows: {
      stripedStyle: {
        backgroundColor: "#5d1902" /* bg-red2 */,
        color: "#eddfc5" /* text-yellow2 */
      },
      style: {
        backgroundColor: "#932c04" /* bg-red */,
        color: "#eddfc5" /* text-yellow2 */,
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "left"
      }
    }
  }

  const show = async (): Promise<void> => {
    setShowAdd(false)
    setShowCancel(true)
    reset()
  }

  const cancel = async (): Promise<void> => {
    setShowAdd(true)
    setShowCancel(false)
    reset()
    setSelectedDay(-1)
    setEditing(null)
  }

  const handleClick = async (): Promise<void> => {
    if (showAdd) {
      show()
    } else {
      cancel()
    }
  }

  const handleExpand = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    const obj = e.target as HTMLButtonElement
    setExpandAll(!expandAll)
    obj.title = obj.innerText = expandAll ? "Expand All" : "Collapse All"
    meals.forEach((meal) => (meal.expanded = !meal.disabled ? !expandAll : false))
  }

  const handleChange = async (e: ChangeEvent<HTMLSelectElement>): Promise<void> => {
    setSelectedDay(parseInt((e.target as HTMLSelectElement).value))
  }

  const getMeals = async (): Promise<void> => {
    cancel()
    await fetch(API_URL + "/api/get")
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`)
        }
        return response.json()
      })
      .then((meals: IMeal[]) => {
        meals.forEach((meal: IMeal) => {
          if (!meal.description.length) {
            meal.disabled = true
          }
        })
        setMeals(meals)
        setPending(false)
        if (!meals.length) {
          setExpandAll(false)
        }
      })
      .catch(console.error)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies(getMeals): not a dependency
  useEffect(() => {
    getMeals()
  }, [])

  return (
    <>
      <div className="text-center mt-10 mx-auto px-1 max-w-lg">
        {meals.length ? (
          <span className="float-end mb-1 mr-1 text-yellow2">
            {expandAll ? (
              <MinusIcon className="size-3 inline mr-1 text-yellow2 cursor-pointer" title="Collapse All" />
            ) : (
              <PlusIcon className="size-3 inline mr-1 text-yellow2 cursor-pointer" title="Expand All" />
            )}
            <button className="text-xs cursor-pointer" onClick={handleExpand} title="Expand All" type="button">
              Expand All
            </button>
          </span>
        ) : null}
        <DataTable
          ariaLabel="dtMenu"
          className="border-yellow rounded-md"
          columns={cols}
          customStyles={customStyles}
          data={meals}
          expandableRowDisabled={(row: IMeal): boolean => row.disabled}
          expandableRowExpanded={(row: IMeal): boolean => row.expanded}
          expandableRows
          expandableRowsComponent={expanded}
          expandOnRowClicked
          noDataComponent={<div>There are no meals to display</div>}
          noTableHead
          pointerOnHover
          progressPending={pending}
          striped
        />
      </div>
      {showAdd ? (
        <div className="text-center mt-10">
          <button
            className="cursor-pointer border-1 rounded-md border-yellow px-2 py-1 text-yellow2"
            onClick={handleClick}
            title="Add Meal"
            type="button">
            <PlusCircleIcon className="size-5 inline mr-1 text-yellow" />
            Add Meal
          </button>
        </div>
      ) : null}
      {showCancel ? (
        <>
          <div className="text-center mt-10">
            <button
              className="cursor-pointer border-1 rounded-md border-yellow px-2 py-1 text-yellow2"
              onClick={handleClick}
              title="Cancel"
              type="button">
              <XCircleIcon className="size-5 inline mr-1 text-red" />
              Cancel
            </button>
          </div>
          <form
            className="text-center border-1 border-brown2 size-fit mx-auto px-3 pt-3 my-5"
            onSubmit={handleSubmit(onSubmit)}>
            <select
              {...register("day", {
                required: true,
                validate: {
                  validateValue: async (day: number) => {
                    return day > -1
                  }
                }
              })}
              className="border-1 text-yellow2 border-yellow rounded-md px-3 py-1.5 mr-3 mb-3"
              onChange={handleChange}
              style={
                errors.day && {
                  border: "3px double #932c04" /* text-red */
                }
              }
              value={selectedDay}>
              <option className="bg-red2 font-bold" key="0" value="-1">
                Choose a day...
              </option>
              {Object.keys(days)
                .filter((i: string) => {
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
                required: true
              })}
              className="rounded-md px-3 py-1.5 text-yellow2 border-1 border-yellow placeholder:text-yellow inline mr-3 mb-3"
              placeholder="Enter meal title..."
              style={
                errors.title && {
                  border: "3px double #932c04" /* text-red */
                }
              }
              title="Enter meal title..."
              type="text"
              value={editing?.title}
            />
            <textarea
              {...register("description")}
              className="resize-none rounded-md px-3 py-1.5 text-yellow2 border-1 border-yellow placeholder:text-yellow inline mr-3 align-middle mb-3"
              cols={20}
              placeholder="Enter meal description..."
              rows={2}
              title="Enter meal description..."
              value={editing?.description}
            />
            <button
              className="cursor-pointer border-1 rounded-md border-yellow px-2 py-1 text-yellow2 inline mb-3"
              title="Submit"
              type="submit">
              <PlayCircleIcon className="size-5 inline mr-1 text-yellow" />
              Submit
            </button>
          </form>
        </>
      ) : null}
      <ToastContainer closeButton={false} closeOnClick pauseOnHover={false} position="top-center" theme="dark" />
    </>
  )
}
