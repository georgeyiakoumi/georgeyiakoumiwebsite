"use client";

import dynamic from "next/dynamic";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/section";
import { Typography } from "@/components/ui/typography";
import { type ToolData, type BusinessData, type ProjectData } from "@/lib/strapi-queries";
import { ProjectCard } from "@/components/project-card";
import { ThemedLogo } from "@/components/themed-logo";
import { useState, useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

// Lazy load animation components
const AnimateIcon = dynamic(() => import("@/components/animate-ui/icons/icon").then(mod => ({ default: mod.AnimateIcon })), { ssr: false });
const MessageCircleMore = dynamic(() => import("@/components/animate-ui/icons/message-circle-more").then(mod => ({ default: mod.MessageCircleMore })), { ssr: false });

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
}

interface HomeContentProps {
  aboutData: AboutData | null;
  tools: ToolData[];
  businesses: BusinessData[];
  featuredProjects: ProjectData[];
}

export function HomeContent({ aboutData, tools, businesses, featuredProjects }: HomeContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const toolsGridRef = useRef<HTMLDivElement>(null);

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
  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const handleScroll = () => {
      setShowScrollIndicator(scrollContainer.scrollTop < 100);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

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

        <div
          className={`absolute animate-bounce bottom-32 md:bottom-8 lg:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground transition-opacity duration-300 motion-reduce:hidden ${
            showScrollIndicator ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ArrowDown className="size-5" />
        </div>
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
          <Button variant="outline" href="/projects">
            All projects
          </Button>
        </Section>
      )}

      <Section>
        <Typography variant="h2" align="center">
          {aboutData.heading_businesses}
        </Typography>

          <div className="w-full grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {businesses.map((business, index) => (
              <div key={business.id} className={`aspect-auto ${index > 5 ? "lazy-load" : ""}`}>
                <ThemedLogo data={business} />
              </div>
            ))}
          </div>

      </Section>

      <Section>
        <Typography variant="h2" align="center">
          {aboutData.heading_tools}
        </Typography>

        <div className="flex flex-col items-center gap-8 w-full">
          <div className="xl:static sticky top-20 z-10 py-2 w-full flex justify-center">
            <AnimatedTabs
              tabs={[
                { value: "all", label: "All" },
                { value: "design", label: "Design" },
                { value: "development", label: "Development" },
                { value: "tools", label: "Tools" },
              ]}
              activeTab={activeCategory}
              onTabChange={handleCategoryChange}
              ariaLabel="Filter tools by category"
            />
          </div>

          <div ref={toolsGridRef} className="w-full grid gap-8 grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8">
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
        <AnimateIcon animateOnHover asChild>
          <Button size="lg" href="/contact">
            <MessageCircleMore />
            Get in touch
          </Button>
        </AnimateIcon>
      </Section>
    </>
  );
}
