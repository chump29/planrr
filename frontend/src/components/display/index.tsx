import { useEffect, useState, type MouseEvent } from "react"

import {
  MinusIcon,
  PlayCircleIcon,
  PlusCircleIcon,
  PlusIcon,
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

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<IMeal>()

  const onSubmit: SubmitHandler<IMeal> = (meal: IMeal) => {
    handleClick()
    // TODO
    console.log(meal)
  }

  const cols: TableColumn<IMeal>[] = [
    {
      selector: (col: IMeal) => days[col.day],
      width: "120px"
    },
    {
      selector: (col: IMeal) => col.title,
      wrap: true
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
      .then((menus: IMeal[]) => {
        menus.forEach((menu: IMeal) => {
          if (menu.description.length === 0) {
            menu.disabled = true
          }
        })
        setData(menus)
      })
      .catch((e: Error) => {
        console.error(e)
      })
    reset()
  }, [])

  return (
    <>
      <div className="text-center mt-10 size-fit mx-auto px-1">
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
              }>
              <option key="0" value="">
                Choose a day...
              </option>
              {days.map((day: string, i: number) => (
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
            />
            <textarea
              {...register("description")}
              className="resize-none rounded-md px-3 py-1.5 text-yellow2 border-1 border-yellow placeholder:text-yellow inline mr-3 align-middle mb-3"
              cols={20}
              placeholder="Enter meal description..."
              rows={2}
              title="Enter meal description..."
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
