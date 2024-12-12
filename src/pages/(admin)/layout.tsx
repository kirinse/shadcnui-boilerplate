import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/components/nav-sidebar/app-sidebar"
import { NavBreadcrumb } from "@/components/nav-sidebar/nav-breadcrumb"
import { ThemeCustomizer } from "@/components/theme/theme-customizer"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SIDEBAR_COOKIE_NAME } from "@/constants"

export function Component() {
  const sidebarState = localStorage.getItem(SIDEBAR_COOKIE_NAME) === "true" || true

  return (
    <SidebarProvider defaultOpen={sidebarState}>
      <AppSidebar collapsible="icon" />
      <SidebarInset className="w-full overflow-hidden">
        <div className="sticky top-0 z-10">
          <header className="flex h-14 w-full shrink-0 items-center justify-between border-b bg-background/80 px-2 backdrop-blur-sm sm:h-16 sm:px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-0.5 sm:-ml-1" />
              <Separator orientation="vertical" className="mr-2 hidden h-4 sm:block" />
              <NavBreadcrumb className="hidden sm:flex" />
            </div>
            <div className="flex items-center space-x-2 md:max-w-96 lg:max-w-lg">
              {/* <Search /> */}
              {/* <Link to="https://github.com/TinsFox/shadcnui-boilerplate" target="_blank">
                <Button variant="ghost" size="icon">
                  <Icons.gitHub className="size-5" />
                </Button>
              </Link> */}
              {/* <Link to="https://shadcnui-boilerplate.pages.dev" target="_blank">
                <Button variant="ghost" size="icon">
                  <CircleHelp className="size-5" />
                </Button>
              </Link> */}
              <ThemeSwitcher />
              <ThemeCustomizer />
            </div>
          </header>
        </div>

        <ScrollArea className="flex h-[calc(100vh-3.5rem)] flex-col gap-4 p-2 pt-0 sm:h-[calc(100vh-4rem)] sm:p-4">
          <div className="p-2 sm:py-4">
            <Outlet />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
