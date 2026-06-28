"use client";

import { useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { AUTHOR } from "@/lib/constants";
import { cn } from "@/lib/utils";
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

export function SiteFooter({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const handleMouseEnter = useCallback(() => {
    lottieRef.current?.goToAndPlay(0);
  }, []);

  const LogoLottie = () => (
    <div
      className="size-12 lg:size-14"
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
    <footer className={cn("lg:fixed lg:bottom-16 lg:right-16 box-border flex flex-col items-start lg:items-end", className)}>
      {/* Mobile/Tablet: Drawer */}
      <div className="xl:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button aria-label="Open footer information" className="size-12 flex items-center justify-center lg:size-auto" onMouseEnter={handleMouseEnter}>
              <LogoLottie />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="gap-3 py-8">
              <DrawerTitle>© {currentYear} {AUTHOR.fullName}</DrawerTitle>
              <DrawerDescription>
                Product designer & design engineer.
                Designed and built with Next.js, shadcn/ui, and Strapi
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
              <p className="text-xs opacity-80 mt-1">Product designer & design engineer.<br />Designed and built with Next.js, shadcn/ui, and Strapi.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </footer>
  );
}
