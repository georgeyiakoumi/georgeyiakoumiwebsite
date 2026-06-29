"use client"

import * as React from "react"
import { SunIcon, type SunIconHandle } from "@/components/ui/sun"
import { MoonIcon, type MoonIconHandle } from "@/components/ui/moon"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const sunRef = React.useRef<SunIconHandle>(null)
  const moonRef = React.useRef<MoonIconHandle>(null)

  const toggleTheme = () => {
    sunRef.current?.startAnimation()
    moonRef.current?.startAnimation()
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  return (
    <div data-layout-toggle className={cn("lg:fixed box-border flex items-center justify-center lg:p-0 lg:right-16 lg:top-16 lg:transition-[transform,opacity] lg:duration-300 lg:ease-out lg:will-change-transform motion-reduce:transition-none", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="xl:hover:bg-secondary motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-reduce:transition-none xl:cursor-pointer motion-safe:xl:hover:scale-110">
            <SunIcon ref={sunRef} size={19} className="rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <MoonIcon ref={moonRef} size={19} className="absolute scale-0 transition-transform dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="hidden xl:block">
          {resolvedTheme === "dark" ? (
            <>Turn on the lights</>
          ) : (
            <>Turn off the lights</>
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
