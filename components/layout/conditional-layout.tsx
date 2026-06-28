"use client";

import { usePathname } from "next/navigation";
import { SiteNavigation } from "@/components/layout/site-navigation";
import { LayoutHeader } from "@/components/layout/layout-header";
import { ScrollVisibilityProvider } from "@/hooks/use-scroll-visibility";

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
      <LayoutHeader isSlugPage={isSlugPage} />

      <main className="h-dvh overflow-y-auto relative scrollbar-hide">
        {children}
      </main>
    </ScrollVisibilityProvider>
  );
}
