import { QueryClientProvider } from "@tanstack/react-query"
import { LazyMotion, MotionConfig } from "framer-motion"
import { Provider } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { HotkeysProvider } from "react-hotkeys-hook"
import { I18nextProvider } from "react-i18next"

import { ThemeProvider } from "@/components/theme/theme-provider"
import { ThemeWrapper } from "@/components/theme/theme-wrapper"
import { ThemesStyle } from "@/components/theme/themes-styles"
import { Toaster } from "@/components/ui/sonner"
import { Toaster as PrimitiveToaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { i18n } from "@/i18n"
import { queryClient } from "@/lib/query-client"

const loadFeatures = () =>
  import("../framer-lazy-feature").then((res) => res.default)

export const RootProviders: FC<PropsWithChildren> = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <LazyMotion features={loadFeatures} strict key="framer">
      <MotionConfig
        transition={{
          type: "tween",
          duration: 0.15,
          ease: "easeInOut",
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Provider>
            <ThemeWrapper>
              <ThemeProvider defaultTheme="system">

                <TooltipProvider>
                  <HotkeysProvider initiallyActiveScopes={["home"]}>
                    {children}
                  </HotkeysProvider>
                </TooltipProvider>
                <ThemesStyle />
                <Toaster richColors />
              </ThemeProvider>
            </ThemeWrapper>
          </Provider>
        </QueryClientProvider>
      </MotionConfig>
      <PrimitiveToaster />
    </LazyMotion>
  </I18nextProvider>
)
