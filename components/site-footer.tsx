"use client";

import { useState, useRef, useCallback } from "react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { useTheme } from "next-themes";
import { AUTHOR } from "@/lib/constants";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import gyLogo from "@/public/gy-logo.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  const scrollVisible = useScrollVisibility();
  const { resolvedTheme } = useTheme();
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const handleMouseEnter = useCallback(() => {
    lottieRef.current?.goToAndPlay(0);
  }, []);

  const LogoLottie = () => (
    <div
      className="size-8 md:size-10"
      style={{
        filter: resolvedTheme === "dark" ? "invert(1)" : undefined,
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={gyLogo}
        loop={false}
        autoplay={false}
        className="size-full"
      />
    </div>
  );

  return (
    <footer style={{ transform: `translateX(-50%) translateY(${scrollVisible ? '0' : '-120%'})` }} className={`fixed top-6 left-1/2 md:!transform-none md:translate-x-0 md:bottom-8 md:top-auto md:right-8 md:left-auto lg:bottom-16 lg:right-16 box-border flex flex-col items-start lg:items-end z-10 transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none ${scrollVisible ? 'opacity-100' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}`}>
      {/* Mobile/Tablet: Drawer */}
      <div className="xl:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button aria-label="Open footer information" className="size-12 flex items-center justify-center md:size-auto" onMouseEnter={handleMouseEnter}>
              <LogoLottie />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="gap-3 py-8">
              <DrawerTitle>© {currentYear} {AUTHOR.fullName}</DrawerTitle>
              <DrawerDescription>
                Product designer & design engineer. 
                Site built from scratch with Next.js & shadcn/ui
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop: Tooltip */}
      <div className="hidden xl:block">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="cursor-default" aria-label="Footer information" onMouseEnter={handleMouseEnter}>
                <LogoLottie />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>© {currentYear} {AUTHOR.fullName}</p>
              <p className="text-xs opacity-80 mt-1">Product designer & design engineer.<br />Designed and built from scratch with Next.js & shadcn/ui.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </footer>
  );
}
