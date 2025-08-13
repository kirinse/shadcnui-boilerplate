"use client"

import { AlertTriangle } from "lucide-react"
import { useState } from "react"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { IUser } from "@/schema/user"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: IUser
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState("")

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    onOpenChange(false)
    // console.log(currentRow, "The following user has been deleted:")
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={(
        <span className="text-destructive">
          <AlertTriangle
            className="mr-1 inline-block stroke-destructive"
            size={18}
          />
          {" "}
          删除用户
        </span>
      )}
      desc={(
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete
            {" "}
            <span className="font-bold">{currentRow.name}</span>
            ?
            <br />
            This action will permanently remove the user with the role of
            {" "}
            {/* <span className="font-bold">
              {currentRow.role.toUpperCase()}
            </span>
            {" "} */}
            from the system. This cannot be undone.
          </p>

          <Label className="my-2">
            Username:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter name to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      )}
      confirmText="Delete"
      destructive
    />
  )
}
