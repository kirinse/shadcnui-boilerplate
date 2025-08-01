import clsx from "clsx"
import { useAtom } from "jotai"
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"

import { authTokenAtom } from "@/atoms/auth"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUser } from "@/hooks/query/use-user"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { t } = useTranslation("navigation")
  const { data: user } = useUser()
  // const logout = useUserLogoutMutation()
  const [_, setAuthTokenAtom] = useAtom(authTokenAtom)
  const navigate = useNavigate()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={clsx("data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground")}
            >
              <Avatar className="size-8 rounded-lg">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback className={clsx("rounded-lg", { "text-red-500 font-bold": user.is_admin })}>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover p-1 text-popover-foreground shadow-md"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5">
                <Sparkles className="size-4" />
                <span>{t("user.upgrade_pro")}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1" /> */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5" asChild>
                <Link to="/settings/profile">
                  <BadgeCheck className="size-4" />
                  <span>{t("user.account")}</span>
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5" asChild>
                <Link to="/system/account/billing">
                  <CreditCard className="size-4" />
                  <span>{t("user.billing")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5" asChild>
                <Link to="/system/notifications">
                  <Bell className="size-4" />
                  <span>{t("user.notifications")}</span>
                </Link>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-1.5"
              onSelect={() => { setAuthTokenAtom({}); navigate("/login") }}
            >
              <LogOut className="size-4" />
              <span>{t("user.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
