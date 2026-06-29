"use client";

import { useState, useMemo } from "react";
import { ProjectCard, ProjectCardCarousel, ProjectCardList, ProjectCardGrid } from "@/components/project/project-card";
import { AnimatedTabs, AnimatedTabsSticky } from "@/components/ui/animated-tabs";
import type { AnimatedTab } from "@/components/ui/animated-tabs";
import { List, LayoutGrid, GalleryHorizontal } from "lucide-react";
import type { ProjectData } from "@/lib/strapi-queries";

type ProjectFilter = "client" | "personal" | "article";
type ViewMode = "list" | "grid";
type MobileViewMode = "carousel" | "list";

const viewTabs: AnimatedTab[] = [
  { value: "list", icon: <List className="size-4" /> },
  { value: "grid", icon: <LayoutGrid className="size-4" /> },
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
        <AnimatedTabsSticky mode="fixed" className="flex justify-between items-center lg:-mt-17 lg:pt-17 px-5 md:px-24 lg:px-0 xl:px-16 xl:pt-18 xl:max-w-4xl">
          <AnimatedTabs
            tabs={tabs}
            activeTab={activeFilter}
            onTabChange={(v) => setActiveFilter(v as ProjectFilter)}
            ariaLabel="Filter projects by type"

          />
          <AnimatedTabs
            className="lg:hidden"
            tabs={mobileViewTabs}
            activeTab={mobileViewMode}
            onTabChange={(v) => setMobileViewMode(v as MobileViewMode)}
            ariaLabel="Switch mobile view layout"

          />
          <AnimatedTabs
            className="hidden lg:flex"
            tabs={viewTabs}
            activeTab={viewMode}
            onTabChange={(v) => setViewMode(v as ViewMode)}
            ariaLabel="Switch view layout"

          />
        </AnimatedTabsSticky>
      )}

      {/* Mobile: Carousel or List */}
      {mobileViewMode === "carousel" ? (
        <ProjectCardCarousel projects={filteredProjects} className="lg:hidden overflow-x-hidden" contentClassName="md:mx-24" />
      ) : (
        <ProjectCardList className="flex flex-col lg:hidden w-full px-5 md:px-24 lg:px-0">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="thumb" />
          ))}
        </ProjectCardList>
      )}

      {/* Desktop (lg+) */}
      <div className="hidden lg:block w-full xl:max-w-3xl">
        {viewMode === "list" ? (
          <ProjectCardList>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} variant="list" />
            ))}
          </ProjectCardList>
        ) : (
          <ProjectCardGrid>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} variant="thumb" />
            ))}
          </ProjectCardGrid>
        )}
      </div>
    </>
  );
}
