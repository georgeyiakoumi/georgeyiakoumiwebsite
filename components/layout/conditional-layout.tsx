"use client";

import { usePathname } from "next/navigation";
import { SiteNavigation } from "@/components/layout/site-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { BackButton } from "@/components/project/slug/back-button";
import { ScrollVisibilityProvider } from "@/hooks/use-scroll-visibility";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

function HeaderBackdrop() {
  const scrollVisible = useScrollVisibility();

  return (
    <div
      aria-hidden="true"
      style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }}
      className={`fixed top-0 left-0 right-0 h-20 z-998 pointer-events-none bg-background/90 backdrop-blur-sm lg:hidden transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none ${scrollVisible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

interface ConditionalLayoutProps {
  children: React.ReactNode;
  cvUrl?: string;
  email?: string;
}

export function ConditionalLayout({ children, cvUrl, email }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isSlugPage = pathname.startsWith("/project/") || pathname.startsWith("/article/");

  return (
    <ScrollVisibilityProvider>
      <SiteNavigation cvUrl={cvUrl} email={email} className="z-999" />
      {isSlugPage && <BackButton className="z-999" />}
      <ModeToggle className="z-999" />
      <HeaderBackdrop />

      <main className="h-dvh overflow-y-auto relative scrollbar-hide">
        {children}
      </main>

      <SiteFooter className="z-999" />
    </ScrollVisibilityProvider>
  );
}
