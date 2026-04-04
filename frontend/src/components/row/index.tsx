import { type JSX, useState } from "react"

import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import { useConfirm } from "material-ui-confirm"
import { z } from "zod/mini"

import { type IMeal, zIMeal } from "../../interfaces/IMeal"
import { days, error, getUrl, info } from "../shared"

const DEBUG: boolean = false

const API_URL: string = getUrl()
// v8 ignore if -- @preserve
if (DEBUG) {
  info(`Got API URL: ${API_URL}`)
}

z.config(z.locales.en())

const Row = ({
  meal,
  setSelectedDay,
  setEditing,
  setIsAdding,
  refresh,
  id
}: {
  meal: IMeal
  setSelectedDay: React.Dispatch<React.SetStateAction<number>>
  setEditing: React.Dispatch<React.SetStateAction<IMeal | null>>
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
  refresh: React.Dispatch<React.SetStateAction<number>>
  id: number
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleEdit = async (id: number | undefined): Promise<void> => {
    if (!id) {
      return
    }

    await fetch(`${API_URL}/get/${id}`, {
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
          throw new Error(`Error getting meal ID ${id}`)
        }
        let m: IMeal | null = null
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
        // v8 ignore if -- @preserve
        if (DEBUG) {
          info(`Getting meal ID ${id}`, m)
        }
        setSelectedDay(m!.day)
        setEditing(m)
        setIsAdding(true)
      })
      .catch(error)
  }

  // biome-ignore lint/suspicious/noExplicitAny: does not actually return Promise<>
  const confirm: any = useConfirm()

  const handleDelete = async (id: number | undefined, title: string): Promise<void> => {
    if (!id || !title) {
      return
    }
    const { confirmed } = await confirm({
      cancellationText: "No",
      confirmationText: "Yes",
      content: title,
      title: "Delete meal?",
      cancellationButtonProps: {
        title: "No",
        sx: {
          border: "1px solid #c4751c",
          color: "#eddfc5"
        }
      },
      confirmationButtonProps: {
        autoFocus: true,
        title: "Yes",
        sx: {
          backgroundColor: "#932c04",
          border: "1px solid #c4751c",
          color: "#eddfc5"
        }
      },
      contentProps: {
        sx: {
          backgroundColor: "#3f2723",
          color: "#c4751c",
          fontWeight: "bold"
        }
      },
      dialogActionsProps: {
        sx: {
          backgroundColor: "#3f2723"
        }
      },
      dialogProps: {
        sx: {
          backgroundColor: "#932c04"
        }
      },
      titleProps: {
        sx: {
          backgroundColor: "#3f2723",
          color: "#eddfc5"
        }
      }
    })
    if (confirmed) {
      await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE"
      })
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(`Status: ${response.status}`)
          }
          return response.json()
        })
        .then((result: boolean) => {
          const r: z.core.util.SafeParseResult<boolean> = z.boolean().safeParse(result)
          // v8 ignore else -- @preserve
          if (!r.success) {
            throw new Error(r.error.message)
          } else if (DEBUG) {
            info(`Deleted meal ID ${id}`)
          }
          refresh(Date.now())
        })
        .catch((e: Error) => {
          error(`Error deleting meal ID ${id}`, e)
        })
    }
  }

  return (
    <>
      <TableRow
        data-testid="tr"
        key={meal.title}
        sx={{
          "&:nth-of-type(4n+1)": {
            backgroundColor: "#5d1902"
          }
        }}>
        <TableCell
          sx={{
            borderBottom: 0,
            margin: "10px",
            padding: "10px"
          }}
          width={30}>
          {meal.description ? (
            <IconButton
              onClick={(): void => setIsOpen(!isOpen)}
              size="small"
              sx={{
                color: "#c4751c"
              }}>
              {isOpen ? <KeyboardArrowUpIcon titleAccess="Collapse" /> : <KeyboardArrowDownIcon titleAccess="Expand" />}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell
          sx={{
            borderBottom: 0,
            color: "#eddfc5",
            fontFamily: "montserrat, sans-serif",
            fontWeight: "bold",
            margin: "10px",
            padding: "10px"
          }}
          width={120}>
          {days[meal.day]}
        </TableCell>
        <TableCell
          sx={{
            borderBottom: 0,
            color: "#eddfc5",
            fontFamily: "montserrat, sans-serif",
            fontWeight: "bold",
            margin: "10px",
            padding: "10px",
            wordBreak: "break-word"
          }}>
          {meal.title}
        </TableCell>
        <TableCell
          align="center"
          sx={{
            borderBottom: 0,
            margin: "10px",
            padding: "10px"
          }}
          width={30}>
          <IconButton
            onClick={(): Promise<void> => handleEdit(meal.id)}
            sx={{
              color: "#c4751c",
              cursor: "pointer"
            }}
            title="Edit">
            <EditIcon
              sx={{
                height: "16px",
                width: "16px"
              }}
            />
          </IconButton>
        </TableCell>
        <TableCell
          align="center"
          sx={{
            borderBottom: 0,
            margin: "10px",
            padding: "10px"
          }}
          width={30}>
          <IconButton
            onClick={(): Promise<void> => handleDelete(meal.id, meal.title)}
            sx={{
              color: "#c4751c",
              cursor: "pointer"
            }}
            title="Delete">
            <DeleteIcon
              sx={{
                height: "16px",
                width: "16px"
              }}
            />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow key={id}>
        <TableCell
          colSpan={6}
          sx={{
            borderBottom: 0,
            padding: 0
          }}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Table data-testid="description">
              <TableBody>
                <TableRow
                  sx={{
                    backgroundColor: "#3f2723"
                  }}>
                  <TableCell
                    sx={{
                      borderBottom: 0,
                      color: "#eddfc5",
                      fontFamily: "montserrat, sans-serif",
                      margin: "10px",
                      padding: "10px",
                      whiteSpace: "pre-line"
                    }}>
                    {meal.description}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default Row
