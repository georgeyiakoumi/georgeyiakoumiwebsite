"use client";

import { useState, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPagination } from "@/components/ui/carousel";
import { ProjectCard } from "@/components/project-card";
import { ItemGroup } from "@/components/ui/item";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import type { AnimatedTab } from "@/components/ui/animated-tabs";
import type { ProjectData } from "@/lib/strapi-queries";

type ProjectFilter = "client" | "personal" | "article";

interface ProjectsContentProps {
  projects: ProjectData[];
}

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("client");

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
        <div className="md:sticky md:top-8 lg:top-16 z-10 py-2 w-full flex justify-center">
          <AnimatedTabs
            tabs={tabs}
            activeTab={activeFilter}
            onTabChange={(v) => setActiveFilter(v as ProjectFilter)}
            ariaLabel="Filter projects by type"
          />
        </div>
      )}

      {/* Mobile Carousel */}
      <Carousel className="w-full md:hidden">
        <CarouselContent className="mx-4">
          {filteredProjects.map((project) => (
            <CarouselItem key={project.id} className="px-4">
              <ProjectCard project={project} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {filteredProjects.length > 1 && <CarouselPagination className="mt-4" />}
      </Carousel>

      {/* Tablet Grid */}
      <div className="hidden md:flex md:flex-col lg:hidden w-full max-w-3xl gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Desktop List */}
      <ItemGroup className="hidden lg:flex w-full max-w-3xl gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} scenario="list" />
        ))}
      </ItemGroup>
    </>
  );
}
