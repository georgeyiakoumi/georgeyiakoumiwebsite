"use client";

import { useState, useRef, useMemo } from "react";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { ThemedLogo } from "@/components/themed-logo";
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
    if (window.innerWidth >= 1280) return;
    requestAnimationFrame(() => {
      const target = category === "all"
        ? toolsGridRef.current
        : toolsGridRef.current?.querySelector<HTMLElement>(`[data-category="${category}"]`);
      if (!target) return;
      const scrollContainer = document.querySelector("main");
      if (!scrollContainer) return;
      const offset = 140;
      const top = target.getBoundingClientRect().top + scrollContainer.scrollTop - offset;
      scrollContainer.scrollTo({ top, behavior: "smooth" });
    });
  };

  return (
    <Section>
      <Typography variant="h2" align="center">
        {heading}
      </Typography>

      <div className="flex flex-col items-center gap-8 w-full">
        <AnimatedTabs
          className="max-w-full sticky top-20 z-10 py-2"
          tabs={categoryTabs}
          activeTab={activeCategory}
          onTabChange={handleCategoryChange}
          ariaLabel="Filter tools by category"
        />

        <div ref={toolsGridRef} className="w-full grid gap-8 grid-cols-4 md:grid-cols-7 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8">
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
                <ThemedLogo data={tool} />
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
