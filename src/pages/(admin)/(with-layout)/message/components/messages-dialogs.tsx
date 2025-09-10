import { useMessages } from "../context/messages-context"
import { MessagesDeleteDialog } from "./messages-delete-dialog"
import { MessagesEditDialog } from "./messages-edit-dialog"

export function MessagesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMessages()

  return (
    <>
      {currentRow && (
        <>
          <MessagesEditDialog
            key={`message-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit")
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
          <MessagesDeleteDialog
            key={`message-delete-${currentRow.id}`}
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete")
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
