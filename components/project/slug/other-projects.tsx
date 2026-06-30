"use client";

import { Typography } from "@/components/ui/typography";
import { ProjectCard, ProjectCardCarousel, ProjectCardList } from "@/components/project/project-card";
import type { ProjectData } from "@/lib/strapi-queries";

interface OtherProjectsProps {
  projects: ProjectData[];
  type?: "client" | "personal" | "article";
}

export function OtherProjects({ projects, type }: OtherProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="flex flex-col gap-8 h-screen lg:h-auto lg:py-16 items-center justify-center w-full px-0 lg:px-8 border-t border bg-gradient-to-b from-background to-muted">
      <Typography variant="h2" align="center">
        {type === "article" ? "Other articles" : "Other projects"}
      </Typography>

      {/* Mobile Carousel */}
      <ProjectCardCarousel projects={projects} className="lg:hidden" contentClassName="md:px-24" />

      {/* Desktop List */}
      <ProjectCardList className="hidden lg:flex w-full lg:max-w-xl xl:max-w-3xl">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} variant="list" />
        ))}
      </ProjectCardList>
    </section>
  );
}
