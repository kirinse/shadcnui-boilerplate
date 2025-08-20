import { useWechat } from "@/providers/wechat-provider"

import { useUsers } from "../context/users-context"
import { UsersActionDialog } from "./users-action-dialog"
import { UsersDeleteDialog } from "./users-delete-dialog"
import { UsersWechatLogoutDialog } from "./users-wechat-logout-dialog"

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  const { open: wxOpen, setOpen: setWxOpen } = useWechat()

  return (
    <>
      <UsersActionDialog
        key="user-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />
      <UsersWechatLogoutDialog
        key="user-wechat-logout"
        open={wxOpen === "wechat-logout"}
        onOpenChange={() => setWxOpen("wechat-logout")}
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
