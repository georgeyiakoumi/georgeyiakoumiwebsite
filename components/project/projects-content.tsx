"use client";

import { useState, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { CarouselCounter } from "@/components/ui/carousel-navigation";
import { ProjectCard, ProjectCardList, ProjectCardGrid } from "@/components/project/project-card";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import type { AnimatedTab } from "@/components/ui/animated-tabs";
import { List, LayoutGrid } from "lucide-react";
import type { ProjectData } from "@/lib/strapi-queries";

type ProjectFilter = "client" | "personal" | "article";
type ViewMode = "list" | "grid";

const viewTabs: AnimatedTab[] = [
  { value: "list", label: "List", icon: <List className="size-4" /> },
  { value: "grid", label: "Grid", icon: <LayoutGrid className="size-4" /> },
];

interface ProjectsContentProps {
  projects: ProjectData[];
}

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("client");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const clientCount = projects.filter((p) => (p.type || "client") === "client").length;
  const personalCount = projects.filter((p) => p.type === "personal").length;
  const articleCount = projects.filter((p) => p.type === "article").length;
  const hasPersonal = personalCount > 0;
  const hasArticles = articleCount > 0;
  const hasFilters = hasPersonal || hasArticles;

  const tabs = useMemo(() => {
    const t: AnimatedTab[] = [
      { value: "client", label: "Work", badge: clientCount },
    ];
    if (hasPersonal) t.push({ value: "personal", label: "Lab", badge: personalCount });
    if (hasArticles) t.push({ value: "article", label: "Articles", badge: articleCount });
    return t;
  }, [clientCount, personalCount, articleCount, hasPersonal, hasArticles]);

  const filteredProjects = hasFilters
    ? projects.filter((p) => (p.type || "client") === activeFilter)
    : projects;

  return (
    <>
      {hasFilters && (
        <div className="lg:sticky lg:top-16 z-10 py-2 w-full flex justify-center items-center gap-4">
          <AnimatedTabs
            tabs={tabs}
            activeTab={activeFilter}
            onTabChange={(v) => setActiveFilter(v as ProjectFilter)}
            ariaLabel="Filter projects by type"
          />
          <div className="hidden xl:block">
            <AnimatedTabs
              tabs={viewTabs}
              activeTab={viewMode}
              onTabChange={(v) => setViewMode(v as ViewMode)}
              ariaLabel="Switch view layout"
            />
          </div>
        </div>
      )}

      {/* Mobile Carousel */}
      <Carousel opts={{ align: "center", loop: true, containScroll: false }} className="w-full lg:hidden">
        <CarouselContent className="mx-4">
          {filteredProjects.map((project) => (
            <CarouselItem key={project.id} className="px-1.5">
              <ProjectCard project={project} variant="thumb" showActions={false} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {filteredProjects.length > 1 && (
          <div className="flex items-center justify-between mt-4 px-8">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselCounter />
            <CarouselNext className="static translate-y-0" />
          </div>
        )}
      </Carousel>

      {/* Desktop List (lg default, xl togglable) */}
      {viewMode === "list" ? (
        <ProjectCardList className="hidden lg:flex w-full max-w-3xl">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="list" />
          ))}
        </ProjectCardList>
      ) : (
        <>
          {/* lg–xl: always list (no toggle available) */}
          <ProjectCardList className="hidden lg:flex xl:hidden w-full max-w-3xl">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} variant="list" />
            ))}
          </ProjectCardList>
          {/* xl+: grid when toggled */}
          <ProjectCardGrid className="hidden xl:grid w-full max-w-5xl">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} variant="thumb" />
            ))}
          </ProjectCardGrid>
        </>
      )}
    </>
  );
}
