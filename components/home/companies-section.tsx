"use client";

import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { AnimatedTabs, AnimatedTabsSticky } from "@/components/ui/animated-tabs";
import { LogoCard } from "@/components/logo-card";
import type { BusinessData } from "@/lib/strapi-queries";

interface CompaniesSectionProps {
  heading: string;
  businesses: BusinessData[];
}

export function CompaniesSection({ heading, businesses }: CompaniesSectionProps) {
  const [activeSector, setActiveSector] = useState<string>("all");

  const sectorTabs = useMemo(() => {
    const sectors = businesses
      .map((b) => b.sector?.name)
      .filter((name): name is string => !!name);
    const uniqueSectors = [...new Set(sectors)];
    return [
      { value: "all", label: "All" },
      ...uniqueSectors.map((name) => ({ value: name, label: name })),
    ];
  }, [businesses]);

  return (
    <Section className="px-0">
      <Typography variant="h2" align="center">
        {heading}
      </Typography>

      {sectorTabs.length > 2 && (
        <AnimatedTabsSticky>
          <AnimatedTabs
            tabs={sectorTabs}
            activeTab={activeSector}
            onTabChange={setActiveSector}
            ariaLabel="Filter businesses by sector"
          />
        </AnimatedTabsSticky>
      )}

      <div className="w-full px-8 grid gap-8 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {businesses.map((business, index) => {
          const isActive = activeSector === "all" || business.sector?.name === activeSector;
          return (
            <div
              key={business.id}
              className={`aspect-auto transition-all duration-300 ease-out motion-reduce:transition-none ${
                !isActive ? "opacity-50 blur-sm pointer-events-none scale-90 saturate-50" : "scale-100 saturate-100 opacity-100 blur-0"
              } ${index > 5 ? "lazy-load" : ""}`}
              style={{ willChange: isActive ? 'auto' : 'opacity, filter, transform' }}
            >
              <LogoCard data={business} />
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function CompaniesSectionSkeleton() {
  return (
    <Section>
      <Skeleton className="h-8 w-48" />
      <div className="w-full px-8 grid gap-8 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </Section>
  );
}
