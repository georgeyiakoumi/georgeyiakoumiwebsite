"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { ProjectCardSkeleton, ProjectCardList } from "@/components/project/project-card";
import { Typography } from "@/components/ui/typography";
import { ProjectCard } from "@/components/project/project-card";
import { GalleryVerticalEndIcon, type GalleryVerticalEndIconHandle } from "@/components/ui/gallery-vertical-end";
import type { ProjectData } from "@/lib/strapi-queries";

interface FeaturedWorkSectionProps {
  projects: ProjectData[];
}

export function FeaturedWorkSection({ projects }: FeaturedWorkSectionProps) {
  const galleryIconRef = useRef<GalleryVerticalEndIconHandle>(null);

  if (projects.length === 0) return null;

  return (
    <Section className="space-y-8">
      <Typography variant="h2" align="center">
        Featured work
      </Typography>
      <div className="w-full max-w-3xl">
        <ProjectCardList className="md:hidden">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="thumb" />
          ))}
        </ProjectCardList>
        <ProjectCardList className="hidden md:flex">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="list" />
          ))}
        </ProjectCardList>
      </div>
      <Button variant="outline" asChild>
        <Link
          href="/projects"
          onMouseEnter={() => galleryIconRef.current?.startAnimation()}
          onMouseLeave={() => galleryIconRef.current?.stopAnimation()}
        >
          <GalleryVerticalEndIcon ref={galleryIconRef}/>
          All projects
        </Link>
      </Button>
    </Section>
  );
}

export function FeaturedWorkSectionSkeleton() {
  return (
    <Section>
      <Skeleton className="h-8 w-48" />
      <div className="w-full max-w-3xl">
        <div className="lg:hidden">
          <ProjectCardSkeleton variant="thumb" />
        </div>
        <div className="hidden lg:flex flex-col gap-4">
          <ProjectCardSkeleton variant="list" />
          <ProjectCardSkeleton variant="list" />
        </div>
      </div>
      <Skeleton className="h-10 w-32" />
    </Section>
  );
}
