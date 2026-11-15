"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { AUTHOR } from "@/lib/constants";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { type LottieRefCurrentProps } from "lottie-react";
import gyLogo from "@/public/gy-logo.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const FOOTER_TAGLINE = "Product designer & design engineer. Designed and built with Next.js, Radix UI, and Strapi.";

function PrivacyLink({ onNavigate, className }: { onNavigate: () => void; className?: string }) {
  return (
    <Link
      href="/privacy"
      onClick={onNavigate}
      className={cn("inline-flex min-h-12 items-center text-sm text-muted-foreground underline underline-offset-4 transition-colors duration-150 ease-out xl:min-h-0 xl:hover:text-foreground", className)}
    >
      Privacy
    </Link>
  );
}

export function SiteFooter({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => setMounted(true), []);

  const handleMouseEnter = useCallback(() => {
    lottieRef.current?.goToAndPlay(0);
  }, []);

  const logoLottie = (
    <div
      className="size-12 lg:size-14"
      style={{
        filter: mounted && resolvedTheme === "dark" ? "invert(1)" : undefined,
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
              {logoLottie}
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="gap-3 py-8">
              <DrawerTitle>© {currentYear} {AUTHOR.fullName}</DrawerTitle>
              <DrawerDescription>{FOOTER_TAGLINE}</DrawerDescription>
              <PrivacyLink onNavigate={() => setOpen(false)} className="self-center md:self-start" />
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop: Popover */}
      <div className="hidden xl:block">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button aria-label="Footer information" onMouseEnter={handleMouseEnter}>
              {logoLottie}
            </button>
          </PopoverTrigger>
          <PopoverContent side="left" align="end" className="flex flex-col gap-2">
            <PopoverHeader>
              <PopoverTitle>© {currentYear} {AUTHOR.fullName}</PopoverTitle>
              <PopoverDescription>{FOOTER_TAGLINE}</PopoverDescription>
            </PopoverHeader>
            <PrivacyLink onNavigate={() => setPopoverOpen(false)} className="self-start" />
          </PopoverContent>
        </Popover>
      </div>
    </footer>
  );
}
