"use client";

import { useState, useRef, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { AnimatedTabs, AnimatedTabsSticky } from "@/components/ui/animated-tabs";
import { LogoCard } from "@/components/logo-card";
import { scrollToCategory } from "@/lib/scroll-to-category";
import type { ToolData } from "@/lib/strapi-queries";

interface StackSectionProps {
  heading: string;
  tools: ToolData[];
}

export function StackSection({ heading, tools }: StackSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const toolsGridRef = useRef<HTMLDivElement>(null);

  const categoryTabs = useMemo(() => {
    const categories = tools
      .map((t) => t.category)
      .filter((cat): cat is NonNullable<typeof cat> => !!cat);
    const uniqueCategories = [...new Set(categories)];
    return [
      { value: "all", label: "All" },
      ...uniqueCategories.map((cat) => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ];
  }, [tools]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    scrollToCategory(toolsGridRef, category, "data-category");
  };

  return (
    <Section>
      <Typography variant="h2" align="center">
        {heading}
      </Typography>

      <div className="flex flex-col items-center gap-8 w-full">
        <AnimatedTabsSticky>
          <AnimatedTabs
            tabs={categoryTabs}
            activeTab={activeCategory}
            onTabChange={handleCategoryChange}
            ariaLabel="Filter tools by category"
          />
        </AnimatedTabsSticky>

        <div ref={toolsGridRef} className="w-full grid gap-2 md:gap-2 lg:gap-4 xl:gap-2 2xl:gap-6 md:max-w-xl xl:max-w-3xl 2xl:max-w-4xl md:mx-auto grid-cols-4 md:grid-cols-7 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
          {tools.map((tool) => {
            const isActive = activeCategory === "all" || tool.category === activeCategory;
            return (
              <div
                key={tool.id}
                data-category={tool.category}
                className={`transition-all duration-300 ease-out motion-reduce:transition-none ${
                  !isActive ? "opacity-50 blur-sm pointer-events-none scale-90 saturate-50" : "scale-100 saturate-100 opacity-100 blur-0"
                }`}
                style={{ willChange: isActive ? 'auto' : 'opacity, filter, transform' }}
              >
                <LogoCard data={tool} />
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export function StackSectionSkeleton() {
  return (
    <Section>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-9 w-64 rounded-full" />
      <div className="w-full grid gap-2 md:gap-2 lg:gap-4 xl:gap-2 2xl:gap-6 md:max-w-xl xl:max-w-3xl 2xl:max-w-4xl md:mx-auto grid-cols-4 md:grid-cols-7 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </Section>
  );
}
