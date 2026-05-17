"use client";

import { usePathname } from "next/navigation";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollProgressProvider, ScrollProgress, ScrollProgressContainer } from "@/components/animate-ui/primitives/animate/scroll-progress";
import { ScrollVisibilityProvider } from "@/hooks/use-scroll-visibility";
import { useEffect, useState } from "react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

function HeaderBackdrop() {
  const scrollVisible = useScrollVisibility();

  return (
    <div
      aria-hidden="true"
      style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }}
      className={`fixed top-0 left-0 right-0 h-20 z-9 pointer-events-none bg-background/90 backdrop-blur-sm md:hidden transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none ${scrollVisible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCVSubdomain, setIsCVSubdomain] = useState(false);

  useEffect(() => {
    setIsCVSubdomain(window.location.hostname === 'cv.georgeyiakoumi.com');
  }, []);

  const isCVPage = pathname === "/cv" || isCVSubdomain;

  // Only show scroll progress on pages with long-form content
  const showScrollProgress = pathname === "/" || pathname.startsWith("/project/");

  if (isCVPage) {
    // Simple layout for CV page
    return <main>{children}</main>;
  }

  // Full layout with navigation for other pages
  return (
    <ScrollProgressProvider>
      <ScrollVisibilityProvider>
        <SiteNavigation />
        <ModeToggle />
        <HeaderBackdrop />

        {/* Scroll progress indicator - only on index and project detail pages */}
        {showScrollProgress && (
          <ScrollProgress className="fixed top-0 left-0 h-1 bg-primary z-50 origin-left" />
        )}

        <ScrollProgressContainer asChild>
          <main className="h-dvh overflow-y-auto relative scrollbar-hide">
            {children}
          </main>
        </ScrollProgressContainer>

        <SiteFooter />
      </ScrollVisibilityProvider>
    </ScrollProgressProvider>
  );
}
