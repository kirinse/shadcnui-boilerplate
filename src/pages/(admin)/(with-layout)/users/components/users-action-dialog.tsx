"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { t } from "i18next"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Icons } from "@/components/icons"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRegisterUser, useUpdateUser } from "@/hooks/query/use-user"
import { getFetchErrorMessage } from "@/lib/api-fetch"
import type { IUser, UserForm } from "@/schema/user"
import { formSchema } from "@/schema/user"

interface Props {
  currentRow?: IUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit ?
        {
          ...currentRow,
          password: "",
          confirm_password: "",
          isEdit,
        } :
        {
          name: "",
          email: "",
          password: "",
          confirm_password: "",
          isEdit,
        },
  })

  const updateMutation = useUpdateUser()
  const registerMutation = useRegisterUser()

  const successMsg = `${isEdit ? "用户更新成功" : "用户注册成功"}`

  function onSubmit(values: UserForm) {
    toast.promise((isEdit ? updateMutation : registerMutation).mutateAsync(values), {
      position: "top-center",
      loading: `${isEdit ? "更新" : "注册"}中...`,
      success: () => {
        form.reset()
        onOpenChange(false)
        return successMsg
      },
      error: (error) => {
        const errorMessage = getFetchErrorMessage(error)
        return t(errorMessage)
      },
    })
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the user here. " : "Create new user here. "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full overflow-y-auto py-1">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      名称
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john_doe"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@gmail.com"
                        {...field}
                        type="email"
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      密码
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="e.g., S3cur3P@ssw0rd"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      确认密码
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder="e.g., S3cur3P@ssw0rd"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button type="submit" form="user-form" disabled={updateMutation.isPending || registerMutation.isPending}>
            {(updateMutation.isPending || registerMutation.isPending) && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
