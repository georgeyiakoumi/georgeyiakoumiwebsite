"use client";

import { useState, useMemo } from "react";
import { ProjectCard, ProjectCardCarousel, ProjectCardList, ProjectCardGrid } from "@/components/project/project-card";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import type { AnimatedTab } from "@/components/ui/animated-tabs";
import { List, LayoutGrid, GalleryHorizontal } from "lucide-react";
import type { ProjectData } from "@/lib/strapi-queries";

type ProjectFilter = "client" | "personal" | "article";
type ViewMode = "list" | "grid";
type MobileViewMode = "carousel" | "list";

const viewTabs: AnimatedTab[] = [
  { value: "list", label: "List", icon: <List className="size-4" /> },
  { value: "grid", label: "Grid", icon: <LayoutGrid className="size-4" /> },
];

const mobileViewTabs: AnimatedTab[] = [
  { value: "carousel", icon: <GalleryHorizontal className="size-4" /> },
  { value: "list", icon: <List className="size-4" /> },
];

interface ProjectsContentProps {
  projects: ProjectData[];
}

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("client");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>("carousel");

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
        <div className="lg:sticky lg:top-16 z-10 w-full flex justify-between items-center px-4">
          <AnimatedTabs
            tabs={tabs}
            activeTab={activeFilter}
            onTabChange={(v) => setActiveFilter(v as ProjectFilter)}
            ariaLabel="Filter projects by type"
          />
          <div className="lg:hidden">
            <AnimatedTabs
              tabs={mobileViewTabs}
              activeTab={mobileViewMode}
              onTabChange={(v) => setMobileViewMode(v as MobileViewMode)}
              ariaLabel="Switch mobile view layout"
            />
          </div>
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

      {/* Mobile: Carousel or List */}
      {mobileViewMode === "carousel" ? (
        <ProjectCardCarousel projects={filteredProjects} className="lg:hidden" />
      ) : (
        <ProjectCardGrid className="lg:hidden w-full px-5 grid-cols-1 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="thumb" />
          ))}
        </ProjectCardGrid>
      )}

      {/* Desktop List (lg default, xl togglable) */}
      {viewMode === "list" ? (
        <ProjectCardList className="hidden lg:flex w-full max-w-3xl pt-16">
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
