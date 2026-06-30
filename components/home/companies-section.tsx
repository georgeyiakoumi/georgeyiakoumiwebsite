"use client";

import { useState, useRef, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { AnimatedTabs, AnimatedTabsSticky } from "@/components/ui/animated-tabs";
import { LogoCard } from "@/components/logo-card";
import { scrollToCategory } from "@/lib/scroll-to-category";
import type { BusinessData } from "@/lib/strapi-queries";

interface CompaniesSectionProps {
  heading: string;
  businesses: BusinessData[];
}

export function CompaniesSection({ heading, businesses }: CompaniesSectionProps) {
  const [activeSector, setActiveSector] = useState<string>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const handleSectorChange = (sector: string) => {
    setActiveSector(sector);
    scrollToCategory(gridRef, sector, "data-sector");
  };

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
            onTabChange={handleSectorChange}
            ariaLabel="Filter businesses by sector"
          />
        </AnimatedTabsSticky>
      )}

      <div ref={gridRef} className="w-full px-8 md:px-0 grid gap-8 md:gap-2 lg:gap-12 2xl:gap-6 md:max-w-xl xl:max-w-3xl 2xl:max-w-4xl  grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {businesses.map((business, index) => {
          const isActive = activeSector === "all" || business.sector?.name === activeSector;
          return (
            <div
              key={business.id}
              data-sector={business.sector?.name}
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
    <Section className="px-0">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-9 w-64 rounded-full" />
      <div className="w-full px-8 md:px-0 grid gap-8 md:gap-2 lg:gap-12 2xl:gap-6 md:max-w-xl xl:max-w-3xl 2xl:max-w-4xl grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </Section>
  );
}
