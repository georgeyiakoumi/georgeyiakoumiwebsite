"use client";

import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { SiteFooter } from "@/components/layout/site-footer";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { BackButton } from "@/components/project/slug/back-button";

function HeaderBackdrop() {
  const scrollVisible = useScrollVisibility();

  return (
    <div
      aria-hidden="true"
      style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }}
      className={`fixed top-0 left-0 right-0 h-26 z-998 pointer-events-none bg-background/90 backdrop-blur-sm lg:hidden transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none ${scrollVisible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

interface LayoutHeaderProps {
  isSlugPage: boolean;
}

export function LayoutHeader({ isSlugPage }: LayoutHeaderProps) {
  return (
    <>
      {isSlugPage && <BackButton className="z-999" />}
      <ModeToggle className="z-999" />
      <HeaderBackdrop />
      <SiteFooter className="z-999" />
    </>
  );
}
