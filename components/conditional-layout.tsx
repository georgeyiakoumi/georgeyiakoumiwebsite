"use client";

import { usePathname } from "next/navigation";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteFooter } from "@/components/site-footer";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollVisibilityProvider } from "@/hooks/use-scroll-visibility";
import { useEffect, useState } from "react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

function HeaderBackdrop() {
  const scrollVisible = useScrollVisibility();

  return (
    <div
      aria-hidden="true"
      style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }}
      className={`fixed top-0 left-0 right-0 h-20 z-9 pointer-events-none bg-background/90 backdrop-blur-sm lg:hidden transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none ${scrollVisible ? 'opacity-100' : 'opacity-0'}`}
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
  const [isCVSubdomain, setIsCVSubdomain] = useState(false);

  useEffect(() => {
    setIsCVSubdomain(window.location.hostname === 'cv.georgeyiakoumi.com');
  }, []);

  const isCVPage = pathname === "/cv" || isCVSubdomain;

  if (isCVPage) {
    return <main>{children}</main>;
  }

  return (
    <ScrollVisibilityProvider>
      <SiteNavigation cvUrl={cvUrl} email={email} />
      <ModeToggle />
      <HeaderBackdrop />

      <main className="h-dvh overflow-y-auto relative scrollbar-hide">
        {children}
      </main>

      <SiteFooter />
    </ScrollVisibilityProvider>
  );
}
