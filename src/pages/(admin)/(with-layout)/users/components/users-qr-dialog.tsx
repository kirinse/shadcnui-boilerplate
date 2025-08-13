import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Qr } from "@/schema/wechat"

interface Props {
  data?: Qr
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersQrDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2" />
          <DialogDescription>
            Invite new user to join your team by sending them an email
            invitation. Assign a role to define their access level.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4" />
        <DialogFooter className="gap-y-2" />
      </DialogContent>
    </Dialog>
  )
}
