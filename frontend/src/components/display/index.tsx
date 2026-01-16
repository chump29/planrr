import { useEffect, useState, type MouseEvent } from "react"

import {
  MinusIcon,
  PencilIcon,
  PlayCircleIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"
import DataTable, {
  type TableColumn,
  type TableStyles
} from "react-data-table-component"
import type { ExpandableRowsComponent } from "react-data-table-component/dist/DataTable/types"
import { useForm, type SubmitHandler } from "react-hook-form"

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

interface IMeal {
  day: number
  description: string
  disabled: boolean
  expanded: boolean
  id: number
  title: string
}

const API_URL = import.meta.env.VITE_API_URL || ""

export default function Display() {
  const [data, setData] = useState<IMeal[]>([])
  const [expandAll, setExpandAll] = useState(false)
  const [showAdd, setShowAdd] = useState(true)
  const [showCancel, setShowCancel] = useState(false)
  const [editing, setEditing] = useState<IMeal | null>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<IMeal>()

  const onSubmit: SubmitHandler<IMeal> = (meal: IMeal) => {
    if (editing) {
      fetch(API_URL + "/api/update/" + meal.id, {
        body: JSON.stringify(meal),
        method: "PUT"
      })
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(`Status: ${response.status}`)
          }
          return response.json()
        })
        .then((meal: IMeal) => {
          if (!meal) {
            throw new Error(`Error editing meal: ${meal}`)
          }
          location.reload()
        })
        .catch((e: Error) => {
          console.error(e)
        })
    } else {
      fetch(API_URL + "/api/add/", {
        body: JSON.stringify(meal),
        method: "POST"
      })
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(`Status: ${response.status}`)
          }
          return response.json()
        })
        .then((meal: IMeal) => {
          if (!meal) {
            throw new Error(`Error adding meal: ${meal}`)
          }
          location.reload()
        })
        .catch((e: Error) => {
          console.error(e)
        })
    }
  }

  function handleEdit(e: MouseEvent<SVGSVGElement>) {
    const id = (e.target as SVGElement).dataset.id
    fetch(API_URL + "/api/get/" + id)
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
        setEditing(meal)
        setShowAdd(false)
        setShowCancel(true)
      })
      .catch((e: Error) => {
        console.error(e)
      })
  }

  function handleTrash(e: MouseEvent<SVGSVGElement>) {
    const id = (e.target as SVGElement).dataset.id
    fetch(API_URL + "/api/delete/" + id, {
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
        location.reload()
      })
      .catch((e: Error) => {
        console.error(e)
      })
  }

  const cols: TableColumn<IMeal>[] = [
    {
      selector: (meal: IMeal) => days[meal.day],
      width: "120px"
    },
    {
      selector: (meal: IMeal) => meal.title,
      wrap: true
    },
    {
      button: true,
      cell: (meal: IMeal) => (
        <PencilIcon
          className="size-4 text-yellow cursor-pointer"
          data-id={meal.id}
          onClick={handleEdit}
          title="Edit"
        />
      ),
      ignoreRowClick: true,
      width: "30px"
    },
    {
      button: true,
      cell: (meal: IMeal) => (
        <TrashIcon
          className="size-4 text-yellow cursor-pointer"
          data-id={meal.id}
          onClick={handleTrash}
          title="Remove"
        />
      ),
      ignoreRowClick: true,
      width: "30px"
    }
  ]

  const expanded: ExpandableRowsComponent<IMeal> = ({ data }) => (
    <span>{data.description}</span>
  )

  const customStyles: TableStyles = {
    table: {
      style: {
        border: "1px solid #c4751c" /* border-yellow */,
        borderRadius: "6px" /* rounded-md */
      }
    },
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
    rows: {
      style: {
        backgroundColor: "#932c04" /* bg-red */,
        color: "#eddfc5" /* text-yellow2 */,
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "left"
      },
      stripedStyle: {
        backgroundColor: "#5d1902" /* bg-red2 */,
        color: "#eddfc5" /* text-yellow2 */
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
    }
  }

  function handleClick() {
    if (showAdd) {
      setShowAdd(false)
      setShowCancel(true)
    } else {
      setShowAdd(true)
      setShowCancel(false)
      setEditing(null)
      reset()
    }
  }

  function handleExpand(e: MouseEvent<HTMLButtonElement>) {
    const obj = e.target as HTMLButtonElement
    setExpandAll(!expandAll)
    obj.title = obj.innerText = expandAll ? "Expand All" : "Collapse All"
    data.forEach(
      (meal) => (meal.expanded = !meal.disabled ? !expandAll : false)
    )
  }

  useEffect(() => {
    fetch(API_URL + "/api/get")
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`)
        }
        return response.json()
      })
      .then((meals: IMeal[]) => {
        meals.forEach((meal: IMeal) => {
          if (meal.description.length === 0) {
            meal.disabled = true
          }
        })
        setData(meals)
      })
      .catch((e: Error) => {
        console.error(e)
      })
    reset()
  }, [])

  return (
    <>
      <div className="text-center mt-10 mx-auto px-1 max-w-lg">
        {data.length > 0 ? (
          <span className="float-end mb-1 mr-1 text-yellow2">
            {expandAll ? (
              <MinusIcon
                className="size-3 inline mr-1 text-yellow2 cursor-pointer"
                title="Collapse All"
              />
            ) : (
              <PlusIcon
                className="size-3 inline mr-1 text-yellow2 cursor-pointer"
                title="Expand All"
              />
            )}
            <button
              type="button"
              onClick={handleExpand}
              className="text-xs cursor-pointer"
              title="Expand All">
              Expand All
            </button>
          </span>
        ) : null}
        <DataTable
          ariaLabel="dtMenu"
          columns={cols}
          customStyles={customStyles}
          data={data}
          expandableRowDisabled={(row) => row.disabled}
          expandableRowExpanded={(row) => row.expanded}
          expandableRows
          expandableRowsComponent={expanded}
          expandOnRowClicked
          noDataComponent={<div>There are no meals to display</div>}
          noTableHead
          pointerOnHover
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
            onSubmit={handleSubmit(onSubmit)}
            className="text-center border-1 border-brown2 size-fit mx-auto px-3 pt-3 my-5">
            <select
              {...register("day", { required: true })}
              className="border-1 text-yellow2 border-yellow rounded-md px-3 py-1.5 mr-3 mb-3"
              style={
                errors.day && { border: "3px double #932c04" /* text-red */ }
              }
              value={editing ? days[editing.day] : ""}>
              <option key="0" value="" className="bg-red2 font-bold">
                Choose a day...
              </option>
              {days
                .filter((day: string) => {
                  return editing && days[editing.day] === day
                    ? day
                    : !data.find((meal: IMeal) => days[meal.day] === day)
                })
                .map((day: string, i: number) => (
                  <option className="bg-red2" key={i} value={day}>
                    {day}
                  </option>
                ))}
            </select>
            <input
              {...register("title", { required: true })}
              className="rounded-md px-3 py-1.5 text-yellow2 border-1 border-yellow placeholder:text-yellow inline mr-3 mb-3"
              id="txtTitle"
              placeholder="Enter meal title..."
              style={
                errors.title && { border: "3px double #932c04" /* text-red */ }
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
    </>
  )
}
