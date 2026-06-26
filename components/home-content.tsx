"use client";

import dynamic from "next/dynamic";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { type ToolData, type BusinessData, type ProjectData } from "@/lib/strapi-queries";
import { ProjectCard } from "@/components/project/project-card";
import { ThemedLogo } from "@/components/themed-logo";
import { useState, useRef, useMemo } from "react";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { GalleryVerticalEndIcon, type GalleryVerticalEndIconHandle } from "@/components/ui/gallery-vertical-end";
import Link from "next/link";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

// Lazy load animation component
const AtSignIcon = dynamic(() => import("@/components/ui/at-sign").then(mod => ({ default: mod.AtSignIcon })), { ssr: false });
type AtSignIconHandle = import("@/components/ui/at-sign").AtSignIconHandle;

interface AboutData {
  hero: Array<{
    type: string;
    children?: Array<{ text?: string }>;
    image?: {
      url: string;
      alternativeText?: string;
    };
  }>;
  heading_businesses: string;
  heading_tools: string;
  contact: Array<{
    type: string;
    children?: Array<{ text?: string }>;
  }>;
  email?: string;
}

interface HomeContentProps {
  aboutData: AboutData | null;
  tools: ToolData[];
  businesses: BusinessData[];
  featuredProjects: ProjectData[];
}

export function HomeContent({ aboutData, tools, businesses, featuredProjects }: HomeContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSector, setActiveSector] = useState<string>("all");
  const toolsGridRef = useRef<HTMLDivElement>(null);
  const galleryIconRef = useRef<GalleryVerticalEndIconHandle>(null);
  const atSignRef = useRef<AtSignIconHandle>(null);

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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (window.innerWidth >= 1280) return; // xl+ — no scroll
    requestAnimationFrame(() => {
      const target = category === "all"
        ? toolsGridRef.current
        : toolsGridRef.current?.querySelector<HTMLElement>(`[data-category="${category}"]`);
      if (!target) return;
      const scrollContainer = document.querySelector("main");
      if (!scrollContainer) return;
      const offset = 140; // accounts for sticky tab bar + header elements
      const top = target.getBoundingClientRect().top + scrollContainer.scrollTop - offset;
      scrollContainer.scrollTo({ top, behavior: "smooth" });
    });
  };

  if (!aboutData) {
    return null;
  }

  const heading = aboutData.hero.find(block => block.type === 'heading');
  const avatarBlock = aboutData.hero.find(block => block.type === 'image');
  const paragraphs = aboutData.hero.filter(block => block.type === 'paragraph');

  const headingText = heading?.children?.[0]?.text;
  const avatarUrl = avatarBlock?.image?.url;
  const avatarAlt = avatarBlock?.image?.alternativeText || "Profile photo";

  const contactHeading = aboutData.contact.find(block => block.type === 'heading');
  const contactParagraph = aboutData.contact.find(block => block.type === 'paragraph');

  const contactHeadingText = contactHeading?.children?.[0]?.text;
  const contactDescription = contactParagraph?.children?.[0]?.text;

  return (
    <>
      <Section as="header" className="relative">
        {avatarUrl && (
          <ImageWithFallback
            src={avatarUrl}
            alt={avatarAlt}
            width={128}
            height={128}
            className="size-32 rounded-full mx-auto object-cover select-none"
            draggable={false}
            priority
            fetchPriority="high"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
          />
        )}
        <Typography variant="h1">
          {headingText}
        </Typography>
        {paragraphs.map((para, index) => (
          <Typography key={index} variant="lead" align="center" className="max-w-xl">
            {para.children?.[0]?.text || ''}
          </Typography>
        ))}

        <ScrollIndicator />
      </Section>

      {featuredProjects.length > 0 && (
        <Section>
          <Typography variant="h2" align="center">
            Featured work
          </Typography>
          <div className="w-full max-w-3xl flex flex-col gap-4">
            {featuredProjects.map((project) => (
              <div key={project.id}>
                <div className="lg:hidden">
                  <ProjectCard project={project} />
                </div>
                <div className="hidden lg:block">
                  <ProjectCard project={project} scenario="list" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" asChild>
            <Link
              href="/projects"
              onMouseEnter={() => galleryIconRef.current?.startAnimation()}
              onMouseLeave={() => galleryIconRef.current?.stopAnimation()}
            >
              <GalleryVerticalEndIcon ref={galleryIconRef} size={16} />
              All projects
            </Link>
          </Button>
        </Section>
      )}

      <Section className="px-0">
        <Typography variant="h2" align="center">
          {aboutData.heading_businesses}
        </Typography>

        {sectorTabs.length > 2 && (
          <AnimatedTabs
            className="max-w-full sticky top-20 z-10 py-2"
            tabs={sectorTabs}
            activeTab={activeSector}
            onTabChange={setActiveSector}
            ariaLabel="Filter businesses by sector"
          />
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
                  <ThemedLogo data={business} />
                </div>
              );
            })}
          </div>

      </Section>

      <Section>
        <Typography variant="h2" align="center">
          {aboutData.heading_tools}
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

      <Section>
        <Typography variant="h2" align="center">
          {contactHeadingText}
        </Typography>
        <Typography variant="lead" align="center">
          {contactDescription}
        </Typography>
        {aboutData.email && (
          <Button
            size="lg"
            asChild
            onMouseEnter={() => atSignRef.current?.startAnimation()}
            onMouseLeave={() => atSignRef.current?.stopAnimation()}
          >
            <a href={`mailto:${aboutData.email}`}>
              <AtSignIcon ref={atSignRef} />
              Email me
            </a>
          </Button>
        )}
      </Section>
    </>
  );
}
