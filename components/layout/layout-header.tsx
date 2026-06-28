"use client";

import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/layout/site-footer";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { BackButton } from "@/components/project/slug/back-button";

interface LayoutHeaderProps {
  isSlugPage: boolean;
}

export function LayoutHeader({ isSlugPage }: LayoutHeaderProps) {
  const scrollVisible = useScrollVisibility();

  return (
    <>
      {/* Mobile/Tablet: Backdrop (fades only) */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 h-20 z-998 lg:hidden",
          "bg-background/90 backdrop-blur-sm",
          "transition-opacity duration-300 ease-out motion-reduce:transition-none",
          scrollVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Mobile/Tablet: Elements (slide up/down) */}
      <div
        style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }}
        className={cn(
          "fixed top-0 left-0 right-0 p-4 z-999 lg:hidden",
          "grid grid-cols-[1fr_auto_1fr] items-center",
          "transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none",
          scrollVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {isSlugPage && <BackButton className="col-start-1 justify-self-start" />}
        <SiteFooter className="col-start-2 justify-self-center" />
        <ModeToggle className="col-start-3 justify-self-end" />
      </div>

      {/* Desktop */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none z-999">
        <div className="pointer-events-auto">
          {isSlugPage && <BackButton />}
          <SiteFooter />
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
