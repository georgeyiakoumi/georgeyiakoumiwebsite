"use client";

import { Typography } from "@/components/ui/typography";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { CarouselCounter } from "@/components/ui/carousel-navigation";
import { ProjectCard, ProjectCardList } from "@/components/project/project-card";
import type { ProjectData } from "@/lib/strapi-queries";

interface OtherProjectsProps {
  projects: ProjectData[];
  type?: "client" | "personal" | "article";
}

export function OtherProjects({ projects, type }: OtherProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="flex flex-col gap-8 h-screen lg:h-auto lg:py-16 items-center justify-center w-full border-t border-border bg-muted/10 px-0 lg:px-8">
      <Typography variant="h2" align="center">
        {type === "article" ? "Other articles" : "Other projects"}
      </Typography>

      {/* Mobile Carousel */}
      <Carousel opts={{ align: "center", loop: true, containScroll: false }} className="w-full lg:hidden">
        <CarouselContent className="mx-4">
          {projects.map((project) => (
            <CarouselItem key={project.id} className="px-1.5">
              <ProjectCard project={project} variant="thumb" showActions={false} className="bg-background" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-between mt-4 px-8">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselCounter />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>

      {/* Desktop List */}
      <ProjectCardList className="hidden lg:flex w-full lg:max-w-xl xl:max-w-3xl">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} variant="list" className="bg-background" />
        ))}
      </ProjectCardList>
    </section>
  );
}
