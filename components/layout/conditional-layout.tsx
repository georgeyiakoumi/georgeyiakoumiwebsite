"use client";

import { usePathname } from "next/navigation";
import { LayoutChrome } from "@/components/layout/layout-chrome";
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
      <LayoutChrome isSlugPage={isSlugPage} cvUrl={cvUrl} email={email} />

      <main className="h-dvh overflow-y-auto relative scrollbar-hide">
        {children}
      </main>
    </ScrollVisibilityProvider>
  );
}
