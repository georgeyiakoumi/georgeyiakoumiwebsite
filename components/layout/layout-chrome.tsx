"use client";

import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { cn } from "@/lib/utils";
import { SiteNavigation } from "@/components/layout/site-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { BackButton } from "@/components/layout/back-button";

interface LayoutChromeProps {
  isSlugPage: boolean;
  cvUrl?: string;
  email?: string;
}

export function LayoutChrome({ isSlugPage, cvUrl, email }: LayoutChromeProps) {
  const scrollVisible = useScrollVisibility();

  return (
    <>
      {/* Mobile/Tablet: Backdrop (fades only) */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 h-20 z-40 lg:hidden",
          "bg-background/90 backdrop-blur-sm",
          "transition-opacity duration-300 ease-out motion-reduce:transition-none",
          scrollVisible ? "opacity-100 " : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Mobile/Tablet: Elements (slide up/down) */}
      <div
        style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }}
        className={cn(
          "fixed top-0 left-0 right-0 p-8 md:px-0 mx-auto md:max-w-xl z-45 lg:hidden",
          "grid grid-cols-[1fr_auto_1fr] items-center",
          "bg-background/90 backdrop-blur-sm",
          "transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none",
          scrollVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {isSlugPage && <BackButton className="col-start-1 justify-self-start" />}
        <SiteFooter className="col-start-2 justify-self-center" />
        <ModeToggle className="col-start-3 justify-self-end" />
      </div>

      {/* Mobile/Tablet: Navigation (slides up from bottom) */}
      <SiteNavigation cvUrl={cvUrl} email={email} className="z-45" />

      {/* Desktop */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none z-45">
        <div className="pointer-events-auto">
          {isSlugPage && <BackButton />}
          <SiteFooter />
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
