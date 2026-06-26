"use client"

import * as React from "react"
import { SunIcon, type SunIconHandle } from "@/components/ui/sun"
import { MoonIcon, type MoonIconHandle } from "@/components/ui/moon"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const scrollVisible = useScrollVisibility()
  const sunRef = React.useRef<SunIconHandle>(null)
  const moonRef = React.useRef<MoonIconHandle>(null)

  const toggleTheme = () => {
    sunRef.current?.startAnimation()
    moonRef.current?.startAnimation()
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  return (
    <div style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }} className={`fixed box-border flex items-center justify-center p-4 lg:p-0 right-4 top-4 lg:right-16 lg:top-16 z-11 transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none lg:!transform-none ${scrollVisible ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}`}>
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
