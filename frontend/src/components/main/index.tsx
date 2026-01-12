import { useEffect, useState } from "react"

import { generate } from "random-words"
import DataTable, {
  type TableColumn,
  type TableStyles
} from "react-data-table-component"
import { titleCase } from "title-case"

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

interface IMeal {
  day: string
  title: string
  description: string
}

export default function Main() {
  const [showWeek, setShowWeek] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  const cols: TableColumn<IMeal>[] = [
    {
      selector: (col: IMeal) => col.day,
      width: "100px"
    },
    {
      selector: (col: IMeal) => col.title,
      wrap: true
    }
  ]

  const data: IMeal[] = []
  days.forEach((day) => {
    data.push({
      day: day,
      title: (generate({ min: 2, max: 7 }) as string[])
        .map((s) => titleCase(s))
        .join(" "),
      description: (generate({ min: 10, max: 20 }) as string[])
        .map((s) => titleCase(s))
        .join(" ")
    } as IMeal)
  })

  // @ts-ignore: data
  const expanded = ({ data }) => <span>{data.description}</span>

  const customStyles: TableStyles = {
    expanderButton: {
      style: {
        color: "#c4751c" /* text-yellow */
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
    }
  }

  useEffect(() => {
    // TODO
    setShowWeek(true)
    setShowAdd(true)
  }, [showWeek, showAdd])

  return (
    <>
      {showWeek ? (
        <div className="text-center mt-10 w-sm mx-auto">
          <DataTable
            columns={cols}
            data={data}
            striped
            pointerOnHover
            noTableHead
            expandableRows
            expandableRowsComponent={expanded}
            expandOnRowClicked
            customStyles={customStyles}
          />
        </div>
      ) : null}
      {showAdd ? <div className="text-center mt-10">TODO: Add/Edit Meal(s)</div> : null}
    </>
  )
}
