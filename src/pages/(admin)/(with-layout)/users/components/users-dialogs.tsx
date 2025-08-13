import { useUsers } from "../context/users-context"
import { UsersActionDialog } from "./users-action-dialog"
import { UsersDeleteDialog } from "./users-delete-dialog"
import { UsersQrDialog } from "./users-qr-dialog"
import { UsersWechatDialog } from "./users-wechat-dialog"

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  return (
    <>
      <UsersActionDialog
        key="user-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      <UsersQrDialog
        key="user-qr"
        open={open === "qr"}
        onOpenChange={() => setOpen("qr")}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit")
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
          <UsersWechatDialog
            key={`user-wechat-${currentRow.id}`}
            open={open === "wechat"}
            onOpenChange={() => {
              setOpen("wechat")
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            pid={currentRow.pid}
          />
          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
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
